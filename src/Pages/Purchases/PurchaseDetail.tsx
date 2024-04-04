import { http } from '../../service';
import { Title } from '../../components/Title';
import { RowDetail } from '../../components/RowDetail';
import { ItemEntity } from '../../types/order';
import { IconButton } from '../../components/IconButton';
import { CellDetail } from '../../components/CellDetail';
import { PageContainer } from '../../components/PageContainer';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import {
    primary_red,
    primary_white,
    primary_hover_red,
} from '../../constants/styles';
import {
    Box,
    Card,
    Button,
    Tooltip,
    CardBody,
    CardHeader,
} from '@chakra-ui/react';

export function PurchaseDetail() {
    const [purchaseData, setPurchaseData] = useState<any>();
    const { id } = useParams();
    const navigate = useNavigate();

    async function getPurchase(id: string | undefined) {
        try {
            const response = await http.get(`/purchase/${id}`);
            setPurchaseData(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleStatus(status: string, id: string) {
        if (status === 'PENDENTE') {
            await http.patch(`purchase/finish/${id}`);
        } else {
            await http.patch(`purchase/pending/${id}`);
        }

        location.reload();
    }

    const rowStyle = 'flex-row items-center w-fit gap-2';

    useEffect(() => {
        if (id !== undefined) {
            getPurchase(id);
        }
    }, []);

    return (
        <PageContainer title={`Compra - ${id?.slice(0, 8)}`}>
            <IconButton
                to={-1}
                label='Voltar'
                className='w-fit'
                icon={ArrowLeftCircle}
                bgColor={primary_red}
                textColor={primary_white}
                bgHoverColor={primary_hover_red}
            />
            <Box className='flex border-4 border-amber-500 rounded-md'>
                <Card className='w-full h-[550px] ' background='black'>
                    <CardHeader className='flex flex-col justify-center text-2xl font-semibold text-white'>
                        <Box className='flex items-center justify-between w-full bg-zinc-100/15 rounded-b-md px-1'>
                            <Title>Detalhes</Title>
                            <Button
                                height={35}
                                colorScheme='yellow'
                                onClick={() => {
                                    handleStatus(
                                        purchaseData?.status,
                                        purchaseData?.id
                                    );
                                }}
                            >
                                {purchaseData?.status === 'PENDENTE'
                                    ? 'Alterar para FINALIZADO'
                                    : 'Alterar para PENDENTE'}
                            </Button>
                        </Box>
                        <Box className='flex items-center justify-between'>
                            <CellDetail
                                name='Data'
                                content={
                                    purchaseData?.date
                                        ? toFullLocaleDate(purchaseData.date)
                                        : '--'
                                }
                                className={rowStyle}
                                style='text-2xl text-white'
                            />
                            <CellDetail
                                name='Qtde. itens'
                                content={purchaseData?.items?.length || ''}
                                className={rowStyle}
                                style='text-2xl text-white'
                            />
                            <CellDetail
                                name='Status'
                                content={purchaseData?.status || ''}
                                className={rowStyle}
                                style={
                                    purchaseData?.status === 'PENDENTE'
                                        ? 'text-orange-500 text-2xl'
                                        : 'text-yellow-400 text-2xl'
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
                    </CardHeader>

                    <CardBody className='flex flex-col gap-2 m-2 text-white rounded-md border-2 border-amber-500/50 overflow-hidden overflow-y-scroll scrollbar-hide'>
                        <Box className='flex flex-col gap-2 '>
                            {purchaseData?.items.map(
                                (item: ItemEntity, index: number) => {
                                    return (
                                        <RowDetail key={index}>
                                            <CellDetail
                                                name='Produto'
                                                content={item.product.name}
                                            />
                                            <CellDetail
                                                name='Valor/unidade'
                                                content={Number(
                                                    item.product.value
                                                ).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            />
                                            <CellDetail
                                                name='Quantidade'
                                                content={item.quantity}
                                            />
                                            <CellDetail
                                                name='Total'
                                                content={Number(
                                                    item.quantity *
                                                        item.product.value
                                                ).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            />
                                            <Tooltip label='Detalhes do produto'>
                                                <ArrowRightCircle
                                                    className='size-8 hover:cursor-pointer hover:text-amber-400 duration-150'
                                                    onClick={() =>
                                                        navigate(
                                                            `/products/${item.product.id}`
                                                        )
                                                    }
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
