import { Title } from '../../components/Title';
import { Button } from '@/components/ui/button';
import { Content } from '@/components/Content';
import { useOrder } from '../../hooks/useOrder';
import { LgSpinner } from '../../components/LgSpinner';
import { useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { IconButton } from '../../components/IconButton';
import { useNavigate } from 'react-router';
import { OrderEntity } from '../../types/order';
import { PageContainer } from '../../components/PageContainer';
import { table_row_hover } from '../../constants/styles';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';

export function Orders() {
    const { dataOrders, isLoading } = useOrder();

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Management | Vendas';
    }, []);

    if (isLoading) return <LgSpinner />;

    return (
        <PageContainer title='Vendas'>
            <IconButton
                label='Nova venda'
                className='w-fit'
                to='new'
                icon={PlusCircle}
            />

            <div className='flex items-center justify-between'>
                <Title variant='h3'>
                    Registros:{' '}
                    <span className='text-4xl text-primary-red'>
                        {dataOrders.total}
                    </span>
                </Title>
            </div>

            <Content className='w-full overflow-auto'>
                <Table className='font-semibold'>
                    <TableHeader>
                        <TableRow className='bg-primary-black/15 hover:bg-primary-black/15'>
                            <TableHead className='text-primary-black uppercase'>Cód. Pedido</TableHead>
                            <TableHead className='text-primary-black uppercase'>Qtde. itens</TableHead>
                            <TableHead className='text-primary-black uppercase'>Data</TableHead>
                            <TableHead className='text-primary-black uppercase'>Total</TableHead>
                            <TableHead className='text-primary-black uppercase'>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataOrders.orders &&
                            dataOrders.orders.map((order: OrderEntity) => {
                                return (
                                    <TableRow
                                        key={order.id}
                                        className={table_row_hover}
                                    >
                                        <TableCell>{order.id.slice(0, 8)}</TableCell>
                                        <TableCell>{order.quantidade_itens}</TableCell>
                                        <TableCell>
                                            {toFullLocaleDate(order.criado_em)}
                                        </TableCell>
                                        <TableCell>
                                            {Number(
                                                order.total
                                            ).toLocaleString('pt-br', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                className='w-full hover:bg-primary-hover-red'
                                                onClick={() => { navigate(`${order.id}`); }}
                                            >
                                                Ver detalhes
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            }).reverse()}
                    </TableBody>
                </Table>
            </Content>
        </PageContainer>
    );
}
