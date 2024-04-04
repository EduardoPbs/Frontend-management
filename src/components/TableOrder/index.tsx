import { Table } from 'lucide-react';
import { Title } from '../Title';
import { useOrder } from '../../hooks/useOrder';
import { useEffect } from 'react';
import { OrderEntity } from '../../types/order';
import {
    Tr,
    Th,
    Td,
    Box,
    Tbody,
    Thead,
    Spinner,
    TableContainer,
} from '@chakra-ui/react';

export function OrderTable() {
    const { dataOrders, isLoading } = useOrder();

    useEffect(() => {
        document.title = 'Management | Home';
    }, []);

    if (isLoading)
        return (
            <div className='flex justify-center'>
                <Spinner size='xl' color='yellow.500' />
            </div>
        );

    return (
        <Box className='max-h-80 max-w-full overflow-y-scroll scrollbar-hide'>
            <TableContainer>
                <div className='flex items-center justify-between'>
                    <Title variant='h3'>Resumo - Pedidos</Title>

                    <Title variant='h3'>
                        Total:{' '}
                        <span className='text-3xl text-primary-hover-red'>
                            {dataOrders.total}
                        </span>
                    </Title>
                </div>
                <Table size='sm'>
                    <Thead>
                        <Tr>
                            <Th>Cód. Pedido</Th>
                            <Th>Qtde. itens</Th>
                            <Th>Total (R$)</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {dataOrders
                            ? /**@todo Remove slice() method and implement on Backend */
                              dataOrders.orders
                                  .slice(0, 8)
                                  .map((order: OrderEntity) => {
                                      return (
                                          <Tr
                                              key={order.id}
                                              className='border-t-2 border-primary-black hover:bg-light-gray duration-150'
                                          >
                                              <Td>
                                                  {String(order.id).slice(0, 8)}
                                              </Td>
                                              <Td>{order.items.length}</Td>
                                              <Td>
                                                  {Number(
                                                      order.total
                                                  ).toLocaleString('pt-BR', {
                                                      style: 'currency',
                                                      currency: 'BRL',
                                                  })}
                                              </Td>
                                          </Tr>
                                      );
                                  })
                            : []}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
}
