import { Title } from '../../components/Title';
import { Button } from '@/components/ui/button';
import { months } from '@/utils/months';
import { Content } from '@/components/Content';
import { useToast } from '@chakra-ui/react';
import { useOrder } from '../../hooks/useOrder';
import { LgSpinner } from '../../components/LgSpinner';
import { IconButton } from '../../components/IconButton';
import { useNavigate } from 'react-router';
import { OrderEntity } from '../../types/order';
import { useEmployee } from '@/hooks/useEmployee';
import { PageContainer } from '../../components/PageContainer';
import { EmployeeEntity } from '@/types';
import { table_row_hover } from '../../constants/styles';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import { useEffect, useState } from 'react';
import { ArrowUpRightFromCircle, PlusCircle } from 'lucide-react';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Orders() {
    const [selectedEmployee, setSelectedEmployee] = useState<string>();
    const [monthSelected, setMonthSelected] = useState<number>(0);
    const { dataOrders, isLoading, getOrderByMonth, setDataOrders, getOrderByDate } = useOrder();
    const { dataEmployees } = useEmployee();

    const cash_status: boolean = JSON.parse(sessionStorage.getItem('cash_status') || "").open || false;

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        document.title = 'Management | Vendas';
        console.log('orders', dataOrders);
    }, []);

    if (isLoading) return <LgSpinner />;

    return (
        <PageContainer title='Vendas'>
            <div className='flex items-center gap-8'>
                <IconButton
                    label='Nova venda'
                    className={`w-fit ${!cash_status ? 'opacity-50 hover:bg-primary-black cursor-no-drop' : ''}`}
                    to={cash_status ? 'new' : '#'}
                    onClick={() => {
                        if (!cash_status) {
                            toast({
                                title: 'Caixa Fechado.',
                                description: <div className='flex flex-col items-end justify-center gap-2'>
                                    <p>Abra o caixa para realizar uma venda!</p>
                                    <Button
                                        className='flex items-center gap-1 hover:bg-primary-white hover:text-primary-hover-red'
                                        onClick={() => {
                                            navigate('/cash-register');
                                            toast.closeAll();
                                        }}
                                    >
                                        <span className='mb-0.5'>Ir para Caixa</span>
                                        <ArrowUpRightFromCircle className='size-3' />
                                    </Button>
                                </div>,
                                position: 'top-right',
                                status: 'error',
                                isClosable: true,

                            });
                        }
                    }}
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
                    <SelectContent className='max-h-[250px] font-semibold'>
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

                <Select
                    onValueChange={(event: any) => {
                        const month = JSON.parse(event).id;
                        setMonthSelected(month);
                        getOrderByMonth(month, setDataOrders);
                    }}
                >
                    <SelectTrigger className='w-[180px] font-semibold'>
                        <SelectValue placeholder="Mês" />
                    </SelectTrigger>
                    <SelectContent className='max-h-[300px] font-semibold'>
                        <SelectItem value={JSON.stringify({ id: 0, month: 'none' })}>
                            Tudo
                        </SelectItem>
                        {months.map((month: { id: number; month: string; }, index: number) => {
                            return (
                                <SelectItem key={index} value={JSON.stringify(month)} className='capitalize'>
                                    {month.month}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>

                <Select
                    disabled={!monthSelected || monthSelected === 0}
                    onValueChange={(event: any) => {
                        let day = JSON.parse(event);
                        getOrderByDate(monthSelected, day, setDataOrders);
                    }}
                >
                    <SelectTrigger className='w-[180px] font-semibold'>
                        <SelectValue placeholder="Dia" />
                    </SelectTrigger>
                    <SelectContent className='max-h-[250px] font-semibold'>
                        <SelectItem value={JSON.stringify(0)}>
                            Tudo
                        </SelectItem>
                        <div className='grid grid-cols-3'>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day: number) => {
                                return (
                                    <SelectItem key={day} value={JSON.stringify(day)} className='capitalize flex-1'>
                                        {day}
                                    </SelectItem>
                                );
                            })}
                        </div>
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
                            <TableHead className='text-primary-black uppercase'>Forma Pgto.</TableHead>
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
                                        <TableCell>{order.codigo === null ? order.id.slice(0, 8) : String(order.codigo).slice(0, 8)}</TableCell>
                                        <TableCell>{order.quantidade_itens}</TableCell>
                                        <TableCell>{String(order.forma_pagamento)}</TableCell>
                                        <TableCell>{toFullLocaleDate(order.criado_em)}</TableCell>
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
                                            <TableCell>{order.codigo === null ? order.id.slice(0, 8) : String(order.codigo).slice(0, 8)}</TableCell>
                                            <TableCell>{order.quantidade_itens}</TableCell>
                                            <TableCell>{String(order.forma_pagamento)}</TableCell>
                                            <TableCell>{toFullLocaleDate(order.criado_em)}</TableCell>
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
