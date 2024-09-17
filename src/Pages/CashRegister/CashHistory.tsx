import { months } from "@/utils/months";
import { useEffect, useState } from "react";
import { Content } from '@/components/Content';
import { IconButton } from "@/components/IconButton";
import { PageContainer } from "@/components/PageContainer";
import { ArrowLeftCircle } from "lucide-react";
import { table_row_hover } from "@/constants/styles";
import { toFullLocaleDate } from "@/utils/toFullLocaleDate";
import { Caixa, useCashRegister } from "@/hooks/useCashRegister";
import { Table, TableRow, TableBody, TableHead, TableHeader, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";

export function CashHistory() {
    const [monthSelected, setMonthSelected] = useState<number>(0);
    const { historyCashier, getCashierByMonth, getCashierByDate, setHistoryCashier } = useCashRegister();

    useEffect(() => {

    }, [monthSelected]);

    return (
        <PageContainer title='Histórico de Caixas'>
            <div className='flex items-center gap-8 select-none'>
                <IconButton
                    to={-1}
                    label='Voltar'
                    className='w-fit'
                    icon={ArrowLeftCircle}
                />
                <Select
                    onValueChange={(event: any) => {
                        const month: number = JSON.parse(event).id;
                        setMonthSelected(month);
                        getCashierByMonth(month, setHistoryCashier);
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
                        console.log(event);
                        const day: number = Number(event);
                        getCashierByDate(monthSelected, day, setHistoryCashier);

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
            <Content className='w-full overflow-auto'>
                <Table>
                    <TableHeader className='bg-primary-black/15 hover:bg-primary-black/15'>
                        <TableRow>
                            <TableHead className='text-primary-black uppercase'>Cód. Caixa</TableHead>
                            <TableHead className='text-primary-black uppercase'>Valor Abertura</TableHead>
                            <TableHead className='text-primary-black uppercase'>Valor Fechamento</TableHead>
                            <TableHead className='text-primary-black uppercase'>Diferença</TableHead>
                            <TableHead className='text-primary-black uppercase'>Data Abertura</TableHead>
                            <TableHead className='text-primary-black uppercase'>Data Fechamento</TableHead>
                            <TableHead className='text-primary-black uppercase'>Ações</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {historyCashier.map((caixa: Caixa, index: number) => {
                            return (
                                <TableRow key={index} className={table_row_hover}>
                                    <TableCell>{String(caixa.id).slice(0, 8)}</TableCell>
                                    <TableCell>{caixa.valor_abertura.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                    <TableCell>
                                        {toFullLocaleDate(caixa.fechamento) === '--'
                                            ? '--'
                                            : caixa.valor_fechamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </TableCell>
                                    <TableCell className={
                                        (caixa.valor_fechamento - caixa.valor_abertura > 0)
                                            ? 'text-emerald-600'
                                            : ''}>
                                        {(caixa.valor_fechamento - caixa.valor_abertura > 0) ? '+' : (caixa.valor_fechamento - caixa.valor_abertura === 0) ?? ''}
                                        {caixa.valor_fechamento >= 1 ? (caixa.valor_fechamento - caixa.valor_abertura).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '--'}
                                    </TableCell>
                                    <TableCell>{toFullLocaleDate(caixa.abertura)}</TableCell>
                                    <TableCell>{toFullLocaleDate(caixa.fechamento)}</TableCell>
                                    <TableCell>
                                        <Button className="hover:bg-primary-hover-red w-full">
                                            Detalhes
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
};