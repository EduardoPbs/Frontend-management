import { CustomTh } from '../../components/CustomTh';
import { PageContainer } from '../../components/PageContainer';
import { table_row_hover } from '../../constants/styles';
import { useCashRegister } from '../../hooks/useCashRegister';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import {
    Tr,
    Td,
    Box,
    Tbody,
    Thead,
    Table,
    TableContainer,
} from '@chakra-ui/react';

export function CashRegister() {
    const { cashRegisterData } = useCashRegister();

    function operationType(operation: string) {
        switch (operation) {
            case 'ENTRANCE':
                return <span className='text-agreed-green'>ENTRADA</span>;
            case 'PULLOUT':
                return <span className='text-primary-hover-red'>RETIRADA</span>;
            default:
                return <span className='text-dark-gray'>Não informado.</span>;
        }
    }

    return (
        <PageContainer title='Caixa'>
            <p className='text-lg font-semibold'>
                Total em caixa:{' '}
                <span className='text-2xl font-bold text-primary-red'>
                    {Number(cashRegisterData.amount).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}
                </span>
            </p>
            <Box className='overflow-y-scroll scrollbar-hide border-2 border-border-gray rounded-round-default'>
                <TableContainer>
                    <Table size='sm'>
                        <Thead className='text-primary-white text-xl select-none'>
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
                                                className={table_row_hover}
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
