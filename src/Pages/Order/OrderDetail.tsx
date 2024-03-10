import { useNavigate, useParams } from 'react-router';
import { DrawerModal } from '../../components/DrawerModal';
import { PageContainer } from '../../components/PageContainer';
import { Title } from '../../components/Title';
import { ArrowLeft } from 'lucide-react';
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Spinner,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { http } from '../../service';

export function OrderDetail() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [orderData, setOrderData] = useState<{
        id: string;
        items: any[];
        date: any;
        total: number;
    }>();
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

    if (isLoading)
        return (
            <PageContainer>
                <div className='flex justify-center'>
                    <Spinner size='xl' color='yellow.500' />
                </div>
            </PageContainer>
        );

    return (
        <PageContainer>
            <div className='flex items-center justify-start gap-4'>
                <DrawerModal />

                <Title>Pedido - {id?.slice(0, 8)}</Title>
            </div>

            <div className='flex flex-col gap-4 w-full h-fit overflow-hidden'>
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
                        <CardHeader className='flex items-center justify-between text-2xl font-semibold text-white'>
                            <p className='capitalize text-lg font-semibold'>
                                Data:{' '}
                                <span className='font-bold text-2xl'>
                                    {new Date(
                                        orderData?.date
                                    ).toLocaleDateString('pt-Br')}
                                    {' - '}
                                    {new Date(orderData?.date).getHours()}:
                                    {new Date(orderData?.date).getMinutes()}{' '}
                                    {new Date(orderData?.date).getHours() > 12
                                        ? 'PM'
                                        : 'AM'}
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
                                <span className='font-bold text-3xl text-cyan-200'>
                                    {Number(orderData?.total).toLocaleString(
                                        'pt-br',
                                        { style: 'currency', currency: 'BRL' }
                                    )}
                                </span>
                            </p>
                        </CardHeader>

                        <CardBody className='flex flex-col gap-2 m-2 text-white rounded-md border-2 border-amber-500/50 overflow-hidden overflow-y-scroll'>
                            <Box className='flex flex-col gap-2'>
                                {orderData?.items.map(
                                    (item: any, index: number) => {
                                        return (
                                            <div
                                                key={index}
                                                className='flex justify-between gap-4 border-2 h-[80px] border-amber-400 px-2 py-4 hover:bg-zinc-100/30 duration-150'
                                            >
                                                <p className='flex flex-col font-semibold text-lg'>
                                                    Produto:{' '}
                                                    <span className='font-bold text-cyan-200 text-xl'>
                                                        {item.product.name}
                                                    </span>
                                                </p>
                                                <p className='flex flex-col font-semibold text-lg'>
                                                    Valor/unidade:{' '}
                                                    <span className='font-bold text-cyan-200 text-xl'>
                                                        {Number(
                                                            item.product.value
                                                        ).toLocaleString(
                                                            'pt-BR',
                                                            {
                                                                style: 'currency',
                                                                currency: 'BRL',
                                                            }
                                                        )}
                                                    </span>
                                                </p>
                                                <p className='flex flex-col font-semibold text-lg'>
                                                    Quantidade:{' '}
                                                    <span className='font-bold text-cyan-200 text-xl'>
                                                        {item.quantity}
                                                    </span>
                                                </p>
                                            </div>
                                        );
                                    }
                                )}
                            </Box>
                        </CardBody>
                    </Card>
                </Box>
            </div>
        </PageContainer>
    );
}
