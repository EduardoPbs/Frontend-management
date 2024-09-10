import { http } from '../../service';
import { Title } from '../../components/Title';
import { Button } from '@/components/ui/button';
import { useOrder } from '@/hooks/useOrder';
import { useNavigate, useParams } from 'react-router';
import { RowDetail } from '../../components/RowDetail';
import { IconButton } from '../../components/IconButton';
import { CellDetail } from '../../components/CellDetail';
import { PageContainer } from '../../components/PageContainer';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import { useEffect, useState } from 'react';
import { ItemOrderCreate, OrderEntity } from '../../types/order';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { Box, Card, Tooltip, CardBody, CardHeader, useToast } from '@chakra-ui/react';

export function PurchaseDetail() {
    const { getOrderById, orderItems, currentEmployee } = useOrder();
    const [purchaseData, setPurchaseData] = useState<OrderEntity>();
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    async function handleStatus(status: string, id: string) {
        console.table(status);
        await http.put(`/transactions/finalize/${id}`)
            .then((response) => {
                toast({
                    title: 'Sucesso!',
                    description: response.data,
                    status: 'success',
                    position: 'top-right',
                    duration: 1500,
                    isClosable: true,
                });
            });
    }

    const rowStyle = 'flex-row items-center w-fit gap-2';

    useEffect(() => {
        if (id !== undefined) {
            getOrderById(id, setPurchaseData);
        }
    }, [purchaseData]);

    return (
        <PageContainer title={`Compra - ${id?.slice(0, 8)}`}>
            <IconButton
                to={-1}
                label='Voltar'
                className='w-fit'
                icon={ArrowLeftCircle}
            />
            <Box className='flex border-4 border-border-gray rounded-round-default'>
                <Card className='w-full h-[550px]'
                >
                    <CardHeader className='flex flex-col justify-center text-2xl font-semibold text-primary-black'>
                        <Box className='flex items-center justify-between w-full bg-zinc-100/15 rounded-round-default px-1'>
                            <Title>Detalhes</Title>
                            <Button
                                className={`hover:bg-primary-hover-red ${purchaseData?.status === 'FINALIZADO' && 'hidden'}`}
                                onClick={() => {
                                    if (purchaseData) {
                                        handleStatus(
                                            purchaseData.status,
                                            purchaseData.id
                                        );
                                    }
                                }}
                            >
                                {purchaseData?.status === 'PENDENTE'
                                    && 'Alterar para FINALIZADO'}
                            </Button>
                        </Box>
                        <Box className='flex items-center justify-between'>
                            <CellDetail
                                name='Data'
                                content={
                                    purchaseData?.criado_em
                                        ? toFullLocaleDate(purchaseData?.criado_em)
                                        : '--'
                                }
                                className={rowStyle}
                                style='text-2xl text-primary-black'
                            />
                            <CellDetail
                                name='Qtde. itens'
                                content={purchaseData?.quantidade_itens || 0}
                                className={rowStyle}
                                style='text-2xl text-primary-black'
                            />
                            <CellDetail
                                name='Status'
                                content={purchaseData?.status || ''}
                                className={rowStyle}
                                style={
                                    purchaseData?.status === 'PENDENTE'
                                        ? 'text-orange-500 text-2xl'
                                        : 'text-emerald-500 text-2xl'
                                }
                            />
                            <CellDetail
                                name='Total'
                                content={
                                    Number(purchaseData?.total).toLocaleString(
                                        'pt-br',
                                        { style: 'currency', currency: 'BRL' }
                                    ) || ''
                                }
                                className={rowStyle}
                                style='text-3xl'
                            />
                        </Box>
                        <div>
                            <p className='font-bold'>
                                Funcionário: {' '}
                                <span className='uppercase text-primary-hover-red'>
                                    {currentEmployee?.nome}
                                </span>
                            </p>
                        </div>
                    </CardHeader>

                    <CardBody className='flex flex-col gap-2 m-2 rounded-round-default border-2 border-border-gray overflow-hidden overflow-y-scroll scrollbar-hide'>
                        <Box className='flex flex-col gap-2 '>
                            {orderItems.map(
                                (item: ItemOrderCreate, index: number) => {
                                    return (
                                        <RowDetail key={index}>
                                            <CellDetail
                                                name='Produto'
                                                content={item.produto_nome}
                                            />
                                            <CellDetail
                                                name='Valor/unidade'
                                                content={Number(item.valor_unitario)
                                                    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                }
                                            />
                                            <CellDetail
                                                name='Quantidade'
                                                content={item.quantidade}
                                            />
                                            <CellDetail
                                                name='Total'
                                                content={Number(
                                                    item.quantidade *
                                                    item.valor_unitario
                                                ).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            />
                                            <Tooltip label='Detalhes do produto'>
                                                <ArrowRightCircle
                                                    className='size-8 hover:cursor-pointer hover:text-custom-red duration-150'
                                                    onClick={() => navigate('/products')}
                                                />
                                            </Tooltip>
                                        </RowDetail>
                                    );
                                }
                            )}
                        </Box>
                    </CardBody>
                </Card>
            </Box>
        </PageContainer>
    );
}
