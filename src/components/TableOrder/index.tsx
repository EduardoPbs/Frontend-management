import { Spinner } from '@chakra-ui/react';
import { useOrder } from '../../hooks/useOrder';
import { useEffect } from 'react';
import { OrderEntity } from '../../types/order';
import {
    Table,
    TableRow,
    TableCell,
    TableBody,
    TableHead,
    TableHeader,
} from '@/components/ui/table';
import { table_row_hover } from '@/constants/styles';

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
        <Table>
            <TableHeader>
                <TableRow className='bg-primary-black/15 hover:bg-primary-black/15'>
                    <TableHead className='text-primary-black uppercase'>Cód. Venda</TableHead>
                    <TableHead className='text-primary-black uppercase'>Qtde. itens</TableHead>
                    <TableHead className='text-primary-black uppercase'>Total (R$)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {dataOrders ?
                    dataOrders.orders
                        .map((order: OrderEntity) => {
                            return (
                                <TableRow
                                    key={order.id}
                                    className={table_row_hover}
                                >
                                    <TableCell>
                                        {order.codigo !== null ? String(order.codigo) : String(order.id).slice(0, 8)}
                                    </TableCell>
                                    <TableCell>
                                        {order.quantidade_itens}
                                    </TableCell>
                                    <TableCell>
                                        {Number(order.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </TableCell>
                                </TableRow>
                            );
                        }).reverse().slice(0, 8)
                    : []}
            </TableBody>
        </Table>
    );
}