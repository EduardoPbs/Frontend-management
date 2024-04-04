import { http } from '../../service';
import { Title } from '../../components/Title';
import { CustomTh } from '../../components/CustomTh';
import { PlusCircle } from 'lucide-react';
import { IconButton } from '../../components/IconButton';
import { useNavigate } from 'react-router';
import { PageContainer } from '../../components/PageContainer';
import { EmployeeEntity } from '../../types/employee';
import { useEffect, useState } from 'react';
import {
    primary_red,
    primary_white,
    table_row_hover,
    primary_hover_red,
    round_default,
} from '../../constants/styles';
import {
    Tr,
    Td,
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
        document.title = 'Management | Funcionários';
        getEmployeesData();
    }, []);

    return (
        <PageContainer title='Funcionários'>
            <IconButton
                to='new'
                label='Novo Funcionário'
                className='w-fit'
                icon={PlusCircle}
                bgColor={primary_red}
                textColor={primary_white}
                bgHoverColor={primary_hover_red}
            />

            <div className='flex items-center justify-between'>
                <Title variant='h3'>
                    Cadastrados:{' '}
                    <span className='text-4xl text-primary-red'>
                        {dataEmployees?.total}
                    </span>
                </Title>
            </div>

            <Box className='overflow-y-scroll scrollbar-hide border-2 rounded-md'>
                <TableContainer>
                    <Table size='sm'>
                        <Thead className='text-white text-xl select-none'>
                            <Tr>
                                <CustomTh>Cód. Funcionário</CustomTh>
                                <CustomTh>Nome</CustomTh>
                                <CustomTh>CPF</CustomTh>
                                <CustomTh outStyle='border-r-0'>Ações</CustomTh>
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
                                                className={table_row_hover}
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
                                                        borderRadius={
                                                            round_default
                                                        }
                                                        backgroundColor={
                                                            primary_red
                                                        }
                                                        color={primary_white}
                                                        _hover={{
                                                            bg: primary_hover_red,
                                                        }}
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
                                                        borderRadius={
                                                            round_default
                                                        }
                                                        backgroundColor={
                                                            primary_red
                                                        }
                                                        color={primary_white}
                                                        _hover={{
                                                            bg: primary_hover_red,
                                                        }}
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
