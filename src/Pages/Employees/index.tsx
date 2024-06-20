import { Title } from '../../components/Title';
import { Button } from '@/components/ui/button';
import { Content } from '@/components/Content';
import { useEffect } from 'react';
import { IconButton } from '../../components/IconButton';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useEmployee } from '@/hooks/useEmployee';
import { PageContainer } from '../../components/PageContainer';
import { EmployeeEntity } from '../../types/employee';
import { table_row_hover } from '../../constants/styles';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';

export function Employees() {
    const { dataEmployees } = useEmployee();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Management | Funcionários';
    }, []);

    return (
        <PageContainer title='Funcionários'>
            <IconButton
                to='new'
                label='Novo Funcionário'
                className='w-fit'
                icon={PlusCircle}
            />

            <div className='flex items-center justify-between'>
                <Title variant='h3'>
                    Cadastrados:{' '}
                    <span className='text-4xl text-primary-red'>
                        {dataEmployees?.length}
                    </span>
                </Title>
            </div>

            <Content className='w-full overflow-auto'>
                <Table className='font-semibold'>
                    <TableHeader>
                        <TableRow className='bg-primary-black/15 hover:bg-primary-black/15'>
                            <TableHead className='text-primary-black uppercase'>Cód. Funcionário</TableHead>
                            <TableHead className='text-primary-black uppercase'>Nome</TableHead>
                            <TableHead className='text-primary-black uppercase'>CPF</TableHead>
                            <TableHead className='text-primary-black uppercase'>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataEmployees.map((employee: EmployeeEntity, index: number) => {
                            return (
                                <TableRow
                                    key={index}
                                    className={table_row_hover}
                                >
                                    <TableCell>{employee.id.slice(0, 8)}</TableCell>
                                    <TableCell>{employee.nome}</TableCell>
                                    <TableCell>{employee.cpf}</TableCell>
                                    <TableCell className='flex items-center gap-2'>
                                        <Button
                                            className='w-full hover:bg-primary-hover-red'
                                            onClick={() => { navigate(`edit/${employee.id}`); }}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            className='w-full hover:bg-primary-hover-red'
                                            onClick={() => { navigate(`${employee.id}`); }}
                                        >
                                            Ver detalhes
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        }
                        )}
                    </TableBody>
                </Table>
            </Content>
        </PageContainer>
    );
}
