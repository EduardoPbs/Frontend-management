import { http } from '../../service';
import { Title } from '../../components/Title';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { PageContainer } from '../../components/PageContainer';
import { EmployeeEntity } from '../../constants/employee';
import { useEffect, useState } from 'react';
import {
    Tr,
    Td,
    Th,
    Box,
    Tbody,
    Table,
    Thead,
    Button,
    TableContainer,
} from '@chakra-ui/react';

export function Employees() {
    const navigate = useNavigate();
    const [dataEmployees, setDataEmployees] = useState<{
        employees: EmployeeEntity[];
        total: number;
    }>();

    async function getEmployeesData() {
        try {
            const response = await http('/employees/all');
            setDataEmployees({
                employees: response.data,
                total: response.data.length,
            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getEmployeesData();
    }, []);

    return (
        <PageContainer title='Funcionários'>
            <Box className='flex items-center'>
                <Button
                    colorScheme='yellow'
                    className='flex items-center gap-2 capitalize select-none'
                    onClick={() => navigate('new')}
                >
                    <PlusCircle />
                    Novo Funcionário
                </Button>
            </Box>

            <div className='flex items-center justify-between'>
                <Title variant='h3'>
                    Cadastrados:{' '}
                    <span className='text-4xl text-amber-400'>
                        {dataEmployees?.total}
                    </span>
                </Title>
            </div>

            <Box className='overflow-y-scroll scrollbar-hide border-2 rounded-md'>
                <TableContainer>
                    <Table size='sm'>
                        <Thead className='text-white text-xl select-none'>
                            <Tr>
                                <Th>Cód. Funcionário</Th>
                                <Th>Nome</Th>
                                <Th>CPF</Th>
                                <Th>Ações</Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {dataEmployees?.employees &&
                                dataEmployees.employees.map(
                                    (
                                        employee: EmployeeEntity,
                                        index: number
                                    ) => {
                                        return (
                                            <Tr
                                                key={index}
                                                className='font-semibold hover:bg-zinc-100/30 duration-150'
                                            >
                                                <Td>
                                                    {employee.id.slice(0, 8)}
                                                </Td>
                                                <Td>{employee.name}</Td>
                                                <Td>{employee.cpf}</Td>
                                                <Td className='flex items-center gap-2'>
                                                    <Button
                                                        className='w-full'
                                                        height={8}
                                                        colorScheme='yellow'
                                                        onClick={() =>
                                                            navigate(
                                                                `edit/${employee.id}`
                                                            )
                                                        }
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        className='w-full'
                                                        height={8}
                                                        colorScheme='yellow'
                                                        onClick={() =>
                                                            navigate(
                                                                `${employee.id}`
                                                            )
                                                        }
                                                    >
                                                        Ver detalhes
                                                    </Button>
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
