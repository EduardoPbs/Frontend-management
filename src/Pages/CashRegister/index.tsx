import { http } from '../../service';
import { useNavigate } from 'react-router';
import { PageContainer } from '../../components/PageContainer';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import { useEffect, useState } from 'react';
import {
    Th,
    Tr,
    Td,
    Box,
    Tbody,
    Thead,
    Table,
    TableContainer,
} from '@chakra-ui/react';

function CustomTh({ children }: { children: React.ReactNode }) {
    return (
        <Th>
            <span className='text-slate-50 text-lg'>{children}</span>
        </Th>
    );
}

export function CashRegister() {
    const [cashRegisterData, setCashRegisterData] = useState({
        activities: [],
        amount: 0,
    });

    const navigate = useNavigate();

    async function getCashRegisterData() {
        try {
            const [respTotal, respAct] = await Promise.all([
                http.get('/cash-register/balance'),
                http.get('/cash-register/all-activities'),
            ]);
            setCashRegisterData({
                activities: respAct.data,
                amount: respTotal.data,
            });
        } catch (error) {
            console.error(error);
        }
    }

    function operationType(operation: string) {
        switch (operation) {
            case 'ENTRANCE':
                return <span className='text-green-300'>ENTRADA</span>;
            case 'PULLOUT':
                return <span className='text-yellow-600'>RETIRADA</span>;
            default:
                return <span className='text-zinc-400'>Não informado.</span>;
        }
    }

    useEffect(() => {
        getCashRegisterData();
    }, []);

    return (
        <PageContainer title='Caixa'>
            <p className='text-lg font-semibold'>
                Total em caixa:{' '}
                <span className='text-2xl font-bold text-amber-400'>
                    {Number(cashRegisterData.amount).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}
                </span>
            </p>
            <Box className='overflow-y-scroll scrollbar-hide border-2 rounded-md'>
                <TableContainer>
                    <Table size='md'>
                        <Thead className='text-white text-xl select-none'>
                            <Tr>
                                <CustomTh>Cód. registro</CustomTh>
                                <CustomTh>Operação</CustomTh>
                                <CustomTh>Data</CustomTh>
                                <CustomTh>Valor</CustomTh>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {cashRegisterData.activities &&
                                cashRegisterData.activities.map(
                                    (activity: any, index: number) => {
                                        return (
                                            <Tr
                                                key={index}
                                                className='font-semibold hover:bg-zinc-100/30 duration-150'
                                            >
                                                <Td>
                                                    {activity.id.slice(0, 8)}
                                                </Td>
                                                <Td>
                                                    {operationType(
                                                        activity.operation
                                                    )}
                                                </Td>
                                                <Td>
                                                    {toFullLocaleDate(
                                                        activity.createdAt
                                                    )}
                                                </Td>
                                                <Td>
                                                    {Number(
                                                        activity.value
                                                    ).toLocaleString('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    })}
                                                </Td>
                                            </Tr>
                                        );
                                    }
                                )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </PageContainer>
    );
}
