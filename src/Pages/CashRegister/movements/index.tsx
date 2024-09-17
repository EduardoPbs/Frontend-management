import { months } from "@/utils/months";
import { Content } from "@/components/Content";
import { useState } from "react";
import { IconButton } from "@/components/IconButton";
import { PageContainer } from "@/components/PageContainer";
import { ArrowLeftCircle } from "lucide-react";
import { toFullLocaleDate } from "@/utils/toFullLocaleDate";
import { Movimentacao, useCashRegister } from "@/hooks/useCashRegister";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Title } from "@/components/Title";

export function Movements() {
    const [monthSelected, setMonthSelected] = useState<number>(0);
    const { setAllMovements, getMovementsByDate, getMovementsByMonth, allMovements } = useCashRegister();

    return (
        <PageContainer title='Movimentações'>
            <div className='flex items-center gap-8 select-none'>
                <IconButton
                    to={-1}
                    label='Voltar'
                    className='w-fit'
                    icon={ArrowLeftCircle}
                />
                <Select
                    onValueChange={(event: any) => {
                        const month = JSON.parse(event).id;
                        setMonthSelected(month);
                        getMovementsByMonth(month, setAllMovements);
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
                        const day: number = Number(event);
                        getMovementsByDate(monthSelected, day, setAllMovements);
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
                        {allMovements.length}
                    </span>
                </Title>

                <Title variant='h3'>
                    Valor total:{' '}
                    <span className='text-3xl text-primary-red'>
                        {allMovements.reduce((acc: number, currVal: Movimentacao) => currVal.valor + acc, 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                    </span>
                </Title>
            </div>

            <Content className='w-full overflow-auto'>
                <Table>
                    <TableHeader className='bg-primary-black/15 hover:bg-primary-black/15'>
                        <TableRow>
                            <TableHead className='text-primary-black uppercase'>Data Criação</TableHead>
                            <TableHead className='text-primary-black uppercase'>Tipo</TableHead>
                            <TableHead className='text-primary-black uppercase'>Valor</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {allMovements.map((movement: Movimentacao, index: number) => {
                            return (
                                <TableRow key={index} className='font-bold'>
                                    <TableCell>{toFullLocaleDate(movement.criado_em)}</TableCell>
                                    <TableCell>{movement.tipo_transacao || '--'}</TableCell>{/* Está vindo 'null' para não alterar os dados já cadastrados */}
                                    <TableCell>{movement.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Content>
        </PageContainer>
    );
}