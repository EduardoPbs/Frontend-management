import { Title } from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Content } from "@/components/Content";
import { useState } from 'react';
import { useStock } from "@/hooks/useStock";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProduct } from "@/hooks/useProduct";
import { IconButton } from "@/components/IconButton";
import { useEmployee } from "@/hooks/useEmployee";
import { useNavigate } from "react-router";
import { PageContainer } from "@/components/PageContainer";
import { table_row_hover } from "@/constants/styles";
import { toFullLocaleDate } from "@/utils/toFullLocaleDate";
import { EmployeeEntity, OrderEntity, ProductEntity } from "@/types";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AlertCircle, ArrowRightCircle, Package, PackageMinus, PackagePlus } from "lucide-react";
import { months } from "@/utils/months";


export function Stock() {
    const [selectedEmployee, setSelectedEmployee] = useState<string>();
    const [monthSelected, setMonthSelected] = useState<number>(0);

    const { dataStock, setDataStock, getStockByMonth } = useStock();
    const { dataEmployees } = useEmployee();
    const { allProducts } = useProduct();
    const navigate = useNavigate();

    const filteredStockData = dataStock?.entrances.map((e: OrderEntity) => e).concat(dataStock.pullouts.map((p: OrderEntity) => p));

    useEffect(() => {
        document.title = 'Management | Estoque';
    }, []);

    return (
        <PageContainer title='Estoque'>
            <div className='flex items-center gap-2'>
                <IconButton
                    to={'entrance'}
                    label='Registrar Entrada'
                    className='w-fit py-4'
                    icon={PackagePlus}
                />
                <IconButton
                    to={'/products'}
                    label='Produtos'
                    className='w-fit py-4'
                    icon={Package}
                />
                <IconButton
                    to={'output'}
                    label='Registrar Saída'
                    className='w-fit py-4'
                    icon={PackageMinus}
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
                        getStockByMonth(month, setDataStock);
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
            </div>
            <Content className={allProducts?.products
                .filter((p: ProductEntity) => p.estoque <= 10).length < 1 ? 'hidden' : 'w-full border-border-gray h-full'}>
                <Title variant='h3'>
                    Produtos com baixo estoque: {' '}
                    <span className='text-2xl text-primary-red'>{allProducts?.products
                        .filter((p: ProductEntity) => p.estoque <= 10).length}</span>
                </Title>

                <ScrollArea className='h-[150px]'>
                    <div className='flex flex-col gap-2 overflow-hidden rounded-round-default'>
                        {allProducts.products && allProducts?.products
                            .filter((p: ProductEntity) => p.estoque <= 10)
                            .map((prod: ProductEntity, index: number) => (
                                <p
                                    key={index}
                                    className='flex items-center justify-between gap-4 border-2 border-gray-400/60 rounded-round-default px-4 py-2 font-semibold hover:border-primary-hover-red hover:bg-primary-white/50 hover:cursor-default hover:shadow-md duration-150'
                                >
                                    <span className='flex items-center gap-2'>
                                        <AlertCircle className='text-warning-red' />
                                        <span className='w-[200px]'>{prod.nome}</span>
                                    </span>
                                    <span>
                                        Estoque:{' '}
                                        <span
                                            className={
                                                prod.estoque > 5
                                                    ? 'text-custom-red'
                                                    : 'text-primary-hover-red'
                                            }
                                        >
                                            {prod.estoque}
                                        </span>
                                    </span>
                                    <span>
                                        Status:{' '}
                                        <span
                                            className={prod.ativo
                                                ? 'text-agreed-green'
                                                : 'text-primary-hover-red'
                                            }
                                        >
                                            {prod.ativo ? 'Online' : 'Offline'}
                                        </span>
                                    </span>

                                    <ArrowRightCircle
                                        className='hover:cursor-pointer'
                                        onClick={() => { navigate('/products'); }}
                                    />
                                </p>
                            ))}
                    </div>
                </ScrollArea>
            </Content>
            <Content className='w-full border-border-gray h-full xl:max-h-full overflow-y-hidden'>
                <Table className='font-semibold'>
                    <TableHeader>
                        <TableRow className='bg-primary-black/15 hover:bg-primary-black/15'>
                            <TableHead className='text-primary-black uppercase'>Cód. Transação</TableHead>
                            <TableHead className='text-primary-black uppercase'>Qtde. itens</TableHead>
                            <TableHead className='text-primary-black uppercase'>Tipo</TableHead>
                            <TableHead className='text-primary-black uppercase'>Data</TableHead>
                            <TableHead className='text-primary-black uppercase'>Total</TableHead>
                            <TableHead className='text-primary-black uppercase'>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!selectedEmployee ? filteredStockData &&
                            filteredStockData.map((entrance: OrderEntity) => {
                                return (
                                    <TableRow
                                        key={entrance.id}
                                        className={table_row_hover}
                                    >
                                        <TableCell>{entrance.codigo === null ? entrance.id.slice(0, 8) : String(entrance.codigo).slice(0, 8)}</TableCell>
                                        <TableCell>{entrance.quantidade_itens}</TableCell>
                                        <TableCell className='capitalize'>
                                            {String(entrance.tipo).split('_')[0]}
                                        </TableCell>
                                        <TableCell>{toFullLocaleDate(entrance.criado_em)}</TableCell>
                                        <TableCell>
                                            {Number(
                                                entrance.total
                                            ).toLocaleString('pt-br', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                className='w-full hover:bg-primary-hover-red'
                                                onClick={() => { navigate(`${entrance.id}`); }}
                                            >
                                                Ver detalhes
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            }).reverse() : filteredStockData?.map((data: OrderEntity) => {
                                if (data.funcionario_id === selectedEmployee) {
                                    return (
                                        <TableRow
                                            key={data.id}
                                            className={table_row_hover}
                                        >
                                            <TableCell>{data.codigo === null ? data.id.slice(0, 8) : String(data.codigo).slice(0, 8)}</TableCell>
                                            <TableCell>{data.quantidade_itens}</TableCell>
                                            <TableCell className='capitalize'>
                                                {String(data.tipo).split('_')[0]}
                                            </TableCell>
                                            <TableCell>{toFullLocaleDate(data.criado_em)}</TableCell>
                                            <TableCell>
                                                {Number(
                                                    data.total
                                                ).toLocaleString('pt-br', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    className='w-full hover:bg-primary-hover-red'
                                                    onClick={() => { navigate(`${data.id}`); }}
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