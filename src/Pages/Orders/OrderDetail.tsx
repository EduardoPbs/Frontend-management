import { useOrder } from '../../hooks/useOrder';
import { RowDetail } from '../../components/RowDetail';
import { LgSpinner } from '../../components/LgSpinner';
import { CellDetail } from '../../components/CellDetail';
import { IconButton } from '../../components/IconButton';
import { ItemOrderCreate, OrderEntity } from '../../types/order';
import { PageContainer } from '../../components/PageContainer';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { Box, Card, Tooltip, CardBody, CardHeader } from '@chakra-ui/react';
import { Content } from '@/components/Content';

export function OrderDetail() {
    const [orderData, setOrderData] = useState<OrderEntity>();
    const { getOrderById, isLoadingUnique, orderItems, currentEmployee } = useOrder();
    const { id } = useParams();
    const navigate = useNavigate();

    const rowStyle = 'flex-row items-center w-fit gap-2';
    
    const isStock = location.pathname.includes('stock');

    useEffect(() => {
        if (id !== undefined) {
            getOrderById(id, setOrderData);
        }
    }, []);

    if (isLoadingUnique) return <LgSpinner />;

    return (
        <PageContainer title={id?.slice(0, 8)}>
            <IconButton
                to={-1}
                label='Voltar'
                className='w-fit'
                icon={ArrowLeftCircle}
            />

            <Content className='w-full overflow-auto'>
                <Card className='w-full h-[500px]'>
                    <CardHeader className='flex flex-col justify-center text-2xl font-semibold text-primary-black'>
                        <div className='flex items-center justify-between w-full bg-zinc-100/15 rounded-round-default p-1'>
                            <CellDetail
                                name='Data'
                                content={
                                    orderData?.criado_em
                                        ? toFullLocaleDate(orderData.criado_em)
                                        : '--'
                                }
                                className={rowStyle}
                                style='text-3xl text-primary-black'
                            />
                            <CellDetail
                                name='Qtde. itens'
                                content={orderData?.quantidade_itens || 0}
                                className={rowStyle}
                                style='text-3xl text-primary-black'
                            />
                            <CellDetail
                                name='Total'
                                content={
                                    Number(orderData?.total).toLocaleString(
                                        'pt-br',
                                        { style: 'currency', currency: 'BRL' }
                                    ) || ''
                                }
                                className={rowStyle}
                                style='text-3xl'
                            />
                        </div>

                        <Box className='flex items-center justify-between w-full bg-zinc-100/15 rounded-round-default p-1'>
                            <CellDetail
                                name='Vendido por'
                                content={currentEmployee?.nome}
                                className={rowStyle}
                                style='text-2xl'
                            />
                            <CellDetail
                                name='Cód. Vendedor'
                                content={orderData?.funcionario_id.slice(0, 8).toUpperCase() || ''}
                                className={rowStyle}
                                style='text-2xl'
                            />
                            <CellDetail
                                name='Tipo Transação'
                                content={orderData?.tipo.replace('_', ' ')}
                                className={`${rowStyle} capitalize`}
                                style='text-2xl'
                            />
                        </Box>
                    </CardHeader>

                    <CardBody className='flex flex-col gap-2 m-2 text-white bg-primary-white/15 rounded-md border-2 border-border-gray overflow-hidden overflow-y-scroll scrollbar-hide'>
                        <Content className='flex flex-col gap-2 border-none'>
                            {orderItems.map(
                                (item: ItemOrderCreate, index: number) => {
                                    return (
                                        <RowDetail key={index} quantity={100}>
                                            <CellDetail
                                                name='Produto'
                                                content={item.produto_nome}
                                            />
                                            <CellDetail
                                                name={isStock ? 'Valor/compra' : 'Valor/unidade'}
                                                content={Number(
                                                    item.valor_unitario
                                                ).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
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
                                            <Tooltip label='Ir para produtos'>
                                                <ArrowRightCircle
                                                    className='size-8 hover:cursor-pointer hover:text-custom-red duration-150'
                                                    onClick={() =>
                                                        navigate(
                                                            '/products'
                                                        )
                                                    }
                                                />
                                            </Tooltip>
                                        </RowDetail>
                                    );
                                }
                            )}
                        </Content>
                    </CardBody>
                </Card>
            </Content>
        </PageContainer>
    );
}
