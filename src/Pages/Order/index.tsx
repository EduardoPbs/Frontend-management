import { http } from '../../service';
import { Title } from '../../components/Title';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { OrderEntity } from '../../constants/order';
import { PageContainer } from '../../components/PageContainer';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import { useEffect, useState } from 'react';
import {
    Td,
    Tr,
    Th,
    Box,
    Table,
    Tbody,
    Thead,
    Button,
    Spinner,
    TableContainer,
} from '@chakra-ui/react';

export function Orders() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [dataOrders, setDataOrders] = useState<{
        orders: OrderEntity[];
        total: number;
    }>({
        orders: [],
        total: 0,
    });

    const navigate = useNavigate();

    async function getDataOrders() {
        try {
            const response = await http.get('/orders');
            setDataOrders({
                orders: response.data,
                total: response.data.length,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getDataOrders();
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
        <PageContainer title='Pedidos'>
            <Box className='flex items-center'>
                <Button
                    colorScheme='yellow'
                    className='flex items-center gap-2 capitalize select-none'
                    onClick={() => navigate('new')}
                >
                    <PlusCircle />
                    Novo Pedido
                </Button>
            </Box>

            <div className='flex items-center justify-between'>
                <Title variant='h3'>Resumo - Pedidos</Title>

                <Title variant='h3'>
                    Cadastrados:{' '}
                    <span className='text-4xl text-amber-400'>
                        {dataOrders.total}
                    </span>
                </Title>
            </div>

            <Box className='overflow-y-scroll scrollbar-hide border-2 rounded-md'>
                <TableContainer>
                    <Table size='sm'>
                        <Thead className='text-white text-xl select-none'>
                            <Tr>
                                <Th>Cód. Pedido</Th>
                                <Th>Qtde. itens</Th>
                                <Th>Data</Th>
                                <Th>Total</Th>
                                <Th>Ações</Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {dataOrders.orders &&
                                dataOrders.orders.map((order: OrderEntity) => {
                                    return (
                                        <Tr
                                            key={order.id}
                                            className='font-semibold hover:bg-zinc-100/30 duration-150'
                                        >
                                            <Td>{order.id.slice(0, 8)}</Td>
                                            <Td>{order.items.length}</Td>
                                            <Td>
                                                {toFullLocaleDate(order.date)}
                                            </Td>
                                            <Td>
                                                {Number(
                                                    order.total
                                                ).toLocaleString('pt-br', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            </Td>
                                            <Td>
                                                <Button
                                                    className='w-full'
                                                    height={8}
                                                    colorScheme='yellow'
                                                    onClick={() =>
                                                        navigate(`${order.id}`)
                                                    }
                                                >
                                                    Ver detalhes
                                                </Button>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </PageContainer>
    );
}
