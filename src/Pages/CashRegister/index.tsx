import { Title } from '@/components/Title';
import { Button } from '@/components/ui/button';
import { Content } from '@/components/Content';
import { IconButton } from '@/components/IconButton';
import { PageContainer } from '../../components/PageContainer';
import { Input, useToast } from '@chakra-ui/react';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import React, { useEffect, useState } from 'react';
import { Caixa, Movimentacao, useCashRegister } from '../../hooks/useCashRegister';
import { custom_red, primary_hover_red, primary_red } from '@/constants/styles';
import { ClipboardCheck, ClipboardList, History, ArchiveRestore, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogHeader,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';

export function CashRegister() {
    const [handleCaixa, setHandleCaixa] = useState<boolean>(false);
    const [initialValue, setInitialValue] = useState<number>(0);
    const [currentCaixa, setCurrentCaixa] = useState<Caixa>({
        abertura: '',
        fechamento: null,
        valor_abertura: 0,
        valor_atual: 0,
        valor_fechamento: 0
    });
    const { currentCashier, allMovements, closeCurrentCaixa, openCashier, total } = useCashRegister();
    const toast = useToast();

    useEffect(() => {
        setCurrentCaixa(currentCashier);
        document.title = 'Management | Caixa';
    }, [handleCaixa, currentCashier]);

    return (
        <PageContainer title='Caixa'>
            <div className='flex items-center gap-2 select-none'>
                <IconButton
                    to={-1}
                    label='Movimentações'
                    className='w-fit'
                    icon={ArchiveRestore}
                />
                <AlertDialog>
                    <AlertDialogTrigger asChild disabled={currentCaixa?.fechamento !== null}>
                        <Button className='w-[200px] capitalize flex items-center justify-start gap-2 hover:bg-primary-hover-red'>
                            <ClipboardCheck />
                            Fechar caixa
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <div className='flex items-center justify-between'>
                                <Title variant='h3'>Encerrar o caixa atual?</Title>
                                <AlertDialogCancel><X /></AlertDialogCancel>
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogDescription className='max-h-[300px]'>
                            <span className='text-xl text-black font-semibold'>
                                O {' '}
                                <span className='text-primary-red uppercase'>
                                    caixa atual
                                </span> será fechado. Continuar?</span>
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogAction asChild>
                                <Button
                                    className='hover:bg-primary-hover-red'
                                    onClick={() => {
                                        closeCurrentCaixa(setCurrentCaixa);
                                        setHandleCaixa(!handleCaixa);
                                    }}
                                >
                                    Confirmar
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <IconButton
                    to='history'
                    label='Histórico de caixas'
                    className='w-fit'
                    icon={History}
                />
                <AlertDialog>
                    <AlertDialogTrigger asChild disabled={currentCaixa?.fechamento === null}>
                        <Button className='w-[200px] capitalize flex items-center justify-start gap-2 hover:bg-primary-hover-red'>
                            <ClipboardList />
                            Abrir caixa
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <div className='flex items-center justify-between'>
                                <Title variant='h3'>Abrir caixa?</Title>
                                <AlertDialogCancel><X /></AlertDialogCancel>
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogDescription asChild className='max-h-[300px]'>
                            <div className='flex flex-col items-start'>
                                <Input
                                    width={250}
                                    type='number'
                                    borderColor={primary_hover_red}
                                    _hover={{ borderColor: custom_red }}
                                    focusBorderColor={primary_red}
                                    placeholder='Informe um valor'
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInitialValue(Number(e.target.value))}
                                />
                                <span className='text-xl text-black font-semibold'>
                                    Um novo <span className='text-primary-red'>caixa</span> irá ser aberto com:  {Number(initialValue).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}.
                                </span>
                            </div>
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogAction asChild>
                                <Button
                                    className='hover:bg-primary-hover-red '
                                    onClick={() => {
                                        if (initialValue < 1 || initialValue === undefined) {
                                            toast({
                                                title: 'Erro!',
                                                description: 'Informe um valor válido.',
                                                position: 'top-right',
                                                status: 'error',
                                                isClosable: true,
                                            });
                                            return;
                                        }
                                        openCashier(initialValue, setCurrentCaixa);
                                        setHandleCaixa(!handleCaixa);
                                    }}
                                >
                                    Confirmar
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
            <Content className='w-full'>
                <Title variant='h2'>Caixa atual</Title>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3 text-lg font-semibold'>
                        Status:
                        <div className={`flex items-center gap-1 uppercase font-bold text-base ${currentCaixa?.fechamento === null ? 'text-emerald-400' : 'text-red-500'}`}>
                            <div className={`size-6 rounded-full ${currentCaixa?.fechamento === null ? 'bg-emerald-400' : 'bg-red-500'}`} />
                            <span>
                                {currentCaixa?.fechamento === null ? 'Aberto' : 'Fechado'}
                            </span>
                        </div>
                    </div>
                    <p className='text-lg font-semibold uppercase'>
                        {currentCaixa.fechamento === null ? 'Aberto em:' : 'Fechado em:'}{' '}
                        <span className='text-2xl font-bold text-primary-red'>
                            {toFullLocaleDate(currentCaixa.fechamento === null ? currentCaixa.abertura : currentCaixa.fechamento)}
                        </span>
                    </p>
                    <p className='text-lg font-semibold'>
                        Valor inicial:{' '}
                        <span className='text-2xl font-bold text-primary-red'>
                            {Number(currentCaixa?.valor_abertura).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}
                        </span>
                    </p>
                    <p className='text-lg font-semibold'>
                        Total:{' '}
                        <span className='text-2xl font-bold text-primary-red'>
                            {Number(currentCaixa?.valor_atual).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}
                        </span>
                    </p>
                </div>
            </Content>
            <Content className='w-full overflow-auto'>
                <div className='flex items-center justify-between'>
                    <h3 className='uppercase font-bold'>Movimentações - Tudo</h3>
                    <p className='text-xl font-semibold'>Total: {Number(total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className='bg-primary-black/15 hover:bg-primary-black/1'>
                            <TableHead className='text-primary-black uppercase'>Data</TableHead>
                            <TableHead className='text-primary-black uppercase'>Valor</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {allMovements.map(
                            (movimentacao: Movimentacao, index: number) => {
                                return (
                                    <TableRow
                                        key={index}
                                        className='border-t-2 border-primary-black/15 hover:bg-light-gray/25 font-bold'
                                    >
                                        <TableCell>
                                            {toFullLocaleDate(movimentacao.criado_em)}
                                        </TableCell>
                                        <TableCell>
                                            {Number(movimentacao.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                        ).reverse()}
                    </TableBody>
                </Table>
            </Content>
        </PageContainer >
    );
}
