import { Title } from '../../components/Title';
import { Button } from '@/components/ui/button';
import { Content } from '@/components/Content';
import { useOrder } from '../../hooks/useOrder';
import { LgSpinner } from '../../components/LgSpinner';
import { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { IconButton } from '../../components/IconButton';
import { useNavigate } from 'react-router';
import { OrderEntity } from '../../types/order';
import { PageContainer } from '../../components/PageContainer';
import { table_row_hover } from '../../constants/styles';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployee } from '@/hooks/useEmployee';
import { EmployeeEntity } from '@/types/employee';

export function Orders() {
    const [selectedEmployee, setSelectedEmployee] = useState<string>();
    const { dataOrders, isLoading } = useOrder();
    const { dataEmployees } = useEmployee();

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Management | Vendas';
    }, []);

    if (isLoading) return <LgSpinner />;

    return (
        <PageContainer title='Vendas'>
            <div className='flex items-center gap-8'>
                <IconButton
                    label='Nova venda'
                    className='w-fit'
                    to='new'
                    icon={PlusCircle}
                />

                <Select
                    onValueChange={(event) => {
                        const employeeData: { id: string; nome: string; } = JSON.parse(event);
                        setSelectedEmployee(employeeData.id);
                    }}
                >
                    <SelectTrigger className='w-[180px] font-semibold'>
                        <SelectValue placeholder="Funcionário" />
                    </SelectTrigger>
                    <SelectContent className='max-h-[200px] font-semibold'>
                        <SelectItem value='false'>
                            Tudo
                        </SelectItem>
                        {dataEmployees.map((employee: EmployeeEntity, index: number) => {
                            return (
                                <SelectItem key={index} value={JSON.stringify({ id: employee.id, nome: employee.nome })}>
                                    {employee.nome}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            <div className='flex items-center justify-between'>
                <Title variant='h3'>
                    Registros:{' '}
                    <span className='text-4xl text-primary-red'>
                        {!selectedEmployee ? dataOrders.total :
                            dataOrders.orders.filter((order: OrderEntity) => order.funcionario_id === selectedEmployee).length}
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
                        {!selectedEmployee ? dataOrders.orders &&
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
                            }).reverse() : dataOrders.orders.map((order: OrderEntity) => {
                                if (order.funcionario_id === selectedEmployee) {
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
                                }
                            }).reverse()}
                    </TableBody>
                </Table>
            </Content>
        </PageContainer>
    );
}
