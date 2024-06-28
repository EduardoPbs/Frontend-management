import { Title } from '../../components/Title';
import { Button } from '@/components/ui/button';
import { months } from '@/utils/months';
import { Content } from '@/components/Content';
import { LgSpinner } from '../../components/LgSpinner';
import { IconButton } from '../../components/IconButton';
import { OrderEntity } from '@/types';
import { PackagePlus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { usePurchase } from '@/hooks/usePurchase';
import { useEmployee } from '@/hooks/useEmployee';
import { PageContainer } from '../../components/PageContainer';
import { EmployeeEntity } from '@/types';
import { table_row_hover } from '@/constants/styles';
import { toFullLocaleDate } from '@/utils/toFullLocaleDate';
import { useEffect, useState } from 'react';
import { Table, TableRow, TableBody, TableHead, TableHeader, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Purchases() {
    const [selectedEmployee, setSelectedEmployee] = useState<string>();
    const [monthSelected, setMonthSelected] = useState<number>(0);
    const { purchaseData, isLoading, getPurchasesByMonth, getPurchasesByDate, setPurchaseData } = usePurchase();
    const { dataEmployees } = useEmployee();

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Management | Compras';
    }, []);

    if (isLoading) {
        return (
            <LgSpinner />
        );
    };

    return (
        <PageContainer title='Compras'>
            <div className='flex items-center gap-8'>

                <IconButton
                    to={'new'}
                    label='Nova Compra'
                    className='w-fit py-4'
                    icon={PackagePlus}
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
                        getPurchasesByMonth(month, setPurchaseData);
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
                        getPurchasesByDate(monthSelected, day, setPurchaseData);
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
                    Pendentes:{' '}
                    <span className='text-4xl text-primary-red'>
                        {!selectedEmployee ?
                            purchaseData?.purchases.filter((p: any) => {
                                return p.status === 'PENDENTE';
                            }).length
                            : purchaseData?.purchases.filter((purchase: OrderEntity) => {
                                if (purchase.funcionario_id === selectedEmployee && purchase.status === "PENDENTE") {
                                    return purchase;
                                }
                            }).length}
                    </span>
                </Title>

                <Title variant='h3'>
                    Finalizados:{' '}
                    <span className='text-4xl text-primary-red'>
                        {!selectedEmployee ?
                            purchaseData?.purchases.filter((p: any) => {
                                return p.status === 'FINALIZADO';
                            }).length
                            : purchaseData?.purchases.filter((purchase: OrderEntity) => {
                                if (purchase.funcionario_id === selectedEmployee && purchase.status === "FINALIZADO") {
                                    return purchase;
                                }
                            }).length}
                    </span>
                </Title>

                <Title variant='h3'>
                    Cadastrados:{' '}
                    <span className='text-4xl text-primary-red'>
                        {!selectedEmployee ? purchaseData?.total :
                            purchaseData?.purchases.filter((purchase: OrderEntity) => purchase.funcionario_id === selectedEmployee).length}
                    </span>
                </Title>
            </div>

            <Content className='w-full overflow-auto'>
                <Table>
                    <TableHeader className='bg-primary-black/15 hover:bg-primary-black/15'>
                        <TableRow>
                            <TableHead className='text-primary-black uppercase'>Cód. Compra</TableHead>
                            <TableHead className='text-primary-black uppercase'>itens</TableHead>
                            <TableHead className='text-primary-black uppercase'>Data</TableHead>
                            <TableHead className='text-primary-black uppercase'>Total</TableHead>
                            <TableHead className='text-primary-black uppercase'>Status</TableHead>
                            <TableHead className='text-primary-black uppercase'>Ações</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {!selectedEmployee ? purchaseData?.purchases.map((purchase: OrderEntity) => {
                            return (
                                <TableRow
                                    key={purchase.id}
                                    className={table_row_hover}
                                >
                                    <TableCell>{purchase.id.slice(0, 8)}</TableCell>
                                    <TableCell>{purchase.quantidade_itens}</TableCell>
                                    <TableCell>{toFullLocaleDate(purchase.criado_em)}</TableCell>
                                    <TableCell>
                                        {Number(
                                            purchase.total
                                        ).toLocaleString('pt-br', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        })}
                                    </TableCell>
                                    <TableCell
                                        className={`font-bold ${purchase.status === 'PENDENTE' ? 'text-warning-red' : 'text-agreed-green'}`}
                                    >
                                        {purchase.status}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            className='w-full hover:bg-primary-hover-red'
                                            onClick={() => { navigate(`${purchase.id}`); }}
                                        >
                                            Ver detalhes
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        }).reverse() : purchaseData?.purchases.map((purchase: OrderEntity) => {
                            if (purchase.funcionario_id === selectedEmployee) {
                                return (
                                    <TableRow
                                        key={purchase.id}
                                        className={table_row_hover}
                                    >
                                        <TableCell>{purchase.id.slice(0, 8)}</TableCell>
                                        <TableCell>{purchase.quantidade_itens}</TableCell>
                                        <TableCell>{toFullLocaleDate(purchase.criado_em)}</TableCell>
                                        <TableCell>
                                            {Number(
                                                purchase.total
                                            ).toLocaleString('pt-br', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            })}
                                        </TableCell>
                                        <TableCell
                                            className={`font-bold ${purchase.status === 'PENDENTE' ? 'text-warning-red' : 'text-agreed-green'}`}
                                        >
                                            {purchase.status}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                className='w-full hover:bg-primary-hover-red'
                                                onClick={() => { navigate(`${purchase.id}`); }}
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
        </PageContainer >
    );
}
