import { http } from '../../service';
import { PageContainer } from '../../components/PageContainer';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ItemEntity, OrderEntity } from '../../constants/order';
import { ArrowLeft, ArrowRightCircle } from 'lucide-react';
import {
    Box,
    Card,
    Button,
    Spinner,
    CardBody,
    CardHeader,
    Tooltip,
} from '@chakra-ui/react';

export function OrderDetail() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [orderData, setOrderData] = useState<OrderEntity>();
    const { id } = useParams();
    const navigate = useNavigate();

    async function getOrderById(id: string) {
        try {
            const response = await http.get(`/orders/${id}`);
            setOrderData(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (id !== undefined) {
            getOrderById(id);
        }
    }, []);

    function RowProductsOrder({
        name,
        value,
        quantity,
        productId,
    }: {
        name: string;
        value: number;
        quantity: number;
        productId?: string;
    }) {
        return (
            <div className='flex items-center justify-between text-white gap-4 border-2 h-[80px] border-white/50 hover:border-amber-400 p-4 hover:bg-zinc-100/30 select-none duration-150'>
                <p className='flex flex-col font-semibold text-lg min-w-[150px] w-[300px] max-w-full px-2 bg-white/5 rounded-md'>
                    Produto:{' '}
                    <span className='font-bold text-yellow-400 text-xl'>
                        {name}
                    </span>
                </p>
                <p className='flex flex-col font-semibold text-lg min-w-[150px] w-[300px] max-w-full px-2 bg-white/5 rounded-md'>
                    Valor/unidade:{' '}
                    <span className='font-bold text-yellow-400 text-xl'>
                        {Number(value).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </span>
                </p>
                <p className='flex flex-col font-semibold text-lg min-w-[150px] w-[300px] max-w-full px-2 bg-white/5 rounded-md'>
                    Quantidade:{' '}
                    <span className='font-bold text-yellow-400 text-xl'>
                        {quantity}
                    </span>
                </p>

                <Tooltip label='Detalhes do produto'>
                    <ArrowRightCircle
                        className='size-8 hover:cursor-pointer hover:text-amber-400 duration-150'
                        onClick={() => navigate(`/products/${productId}`)}
                    />
                </Tooltip>
            </div>
        );
    }

    if (isLoading)
        return (
            <PageContainer>
                <div className='flex justify-center'>
                    <Spinner size='xl' color='yellow.500' />
                </div>
            </PageContainer>
        );

    return (
        <PageContainer title={`Pedido - ${id?.slice(0, 8)}`}>
            <Box className='flex items-center'>
                <Button
                    colorScheme='yellow'
                    className='flex items-center gap-2 capitalize select-none'
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft />
                    Voltar
                </Button>
            </Box>

            <Box className='flex border-4 border-amber-500 rounded-md'>
                <Card className='w-full h-[500px] ' background='black'>
                    <CardHeader className='flex flex-col justify-center text-2xl font-semibold text-white'>
                        <Box className='flex items-center justify-between w-full bg-zinc-100/15 rounded-t-md px-1'>
                            <p className='capitalize text-lg font-semibold'>
                                Data:{' '}
                                <span className='font-bold text-2xl'>
                                    {orderData?.date
                                        ? toFullLocaleDate(orderData.date)
                                        : '--'}
                                </span>
                            </p>
                            <p className='capitalize text-lg font-semibold'>
                                Qtde. itens:{' '}
                                <span className='font-bold text-2xl'>
                                    {orderData?.items?.length}
                                </span>
                            </p>
                            <p className='capitalize text-lg font-semibold'>
                                Total:{' '}
                                <span className='font-bold text-3xl text-yellow-400'>
                                    {Number(orderData?.total).toLocaleString(
                                        'pt-br',
                                        { style: 'currency', currency: 'BRL' }
                                    )}
                                </span>
                            </p>
                        </Box>

                        <Box className='flex items-center justify-between w-full bg-zinc-100/15 rounded-b-md px-1'>
                            <p className='capitalize text-lg font-semibold'>
                                Vendido por:{' '}
                                <span className='font-bold text-2xl text-yellow-400'>
                                    {orderData?.employee.name}
                                </span>
                            </p>
                            <p className='capitalize text-lg font-semibold'>
                                Cód. Vendedor:{' '}
                                <span className='font-bold text-2xl text-yellow-400'>
                                    {orderData?.employee.id
                                        .slice(0, 8)
                                        .toUpperCase()}
                                </span>
                            </p>
                        </Box>
                    </CardHeader>

                    <CardBody className='flex flex-col gap-2 m-2 text-white rounded-md border-2 border-amber-500/50 overflow-hidden overflow-y-scroll'>
                        <Box className='flex flex-col gap-2'>
                            {orderData?.items.map(
                                (item: ItemEntity, index: number) => {
                                    return (
                                        <RowProductsOrder
                                            key={index}
                                            name={item.product.name}
                                            value={item.product.value}
                                            quantity={item.quantity}
                                            productId={item.product.id}
                                        />
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