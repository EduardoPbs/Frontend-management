import { Title } from '../../components/Title';
import { Button } from '@/components/ui/button';
import { Content } from '@/components/Content';
import { useOrder } from '@/hooks/useOrder';
import { IconButton } from '../../components/IconButton';
import { OrderEntity } from '@/types';
import { useEmployee } from '../../hooks/useEmployee';
import { PageContainer } from '../../components/PageContainer';
import { EmployeeEntity } from '../../types/employee';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeftCircle, Edit, Trash2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@chakra-ui/react';
import { http } from '@/service';

export function EmployeeDetail() {
    const [employeeData, setEmployeeData] = useState<EmployeeEntity>();
    const [employeeTransactions, setEmployeeTransactions] = useState<OrderEntity[]>([]);
    const { getEmployeeById } = useEmployee();
    const { getOrderByEmployeeId } = useOrder();
    const { id } = useParams();

    const user = JSON.parse(sessionStorage.getItem('user') || '');

    useEffect(() => {
        if (id !== undefined) {
            getEmployeeById(id, setEmployeeData);
            getOrderByEmployeeId(id, setEmployeeTransactions);
        }
    }, []);

    const salesRealized: OrderEntity[] = employeeTransactions.filter((transaction: OrderEntity) => transaction.tipo === "VENDA");
    // const procurementsRealized: OrderEntity[] = employeeTransactions.filter((transaction: OrderEntity) => transaction.tipo === "COMPRA");

    return (
        <PageContainer title={`Funcionário - ${id?.slice(0, 8)}`}>
            <IconButton
                to={-1}
                label='Voltar'
                className='w-fit'
                icon={ArrowLeftCircle}
            />
            <Content className='w-full flex items-center overflow-auto'>
                <Card className="bg-white dark:bg-gray-900 w-[600px]">
                    <div className="max-w-2xl px-4 py-4 mx-auto">
                        <CardHeader className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                            <CardTitle>
                                Dados de Funcionário/Usuário
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                                <div className="w-full">
                                    <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Nome:
                                    </p>
                                    <span className='text-primary-red text-lg font-semibold'>{employeeData?.nome}</span>
                                </div>
                                <div className="w-full">
                                    <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                        CPF:
                                    </p>
                                    <span className='text-primary-red text-lg font-semibold'>{employeeData?.cpf}</span>
                                </div>

                                <div className="w-full">
                                    <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Rua:
                                    </p>
                                    <span className='text-primary-red text-lg font-semibold'>{employeeData?.endereco.rua}</span>

                                </div>
                                <div>
                                    <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Bairro:
                                    </p>
                                    <span className='text-primary-red text-lg font-semibold'>{employeeData?.endereco.bairro}</span>
                                </div>
                                <div>
                                    <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Número:
                                    </p>
                                    <span className='text-primary-red text-lg font-semibold'>{employeeData?.endereco.numero || "S/N°"}</span>
                                </div>
                                <div>
                                    <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Complemento:
                                    </p>
                                    <span className='text-primary-red text-lg font-semibold'>{employeeData?.endereco.complemento || "--"}</span>
                                </div>
                                <div>
                                    <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Email:
                                    </p>
                                    <span className='text-primary-red text-lg font-semibold'>{employeeData?.usuario.email || "--"}</span>
                                </div>
                                <span></span>
                                <div>
                                    <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Vendas realizadas:
                                    </p>
                                    <span className='text-primary-red text-lg font-semibold'>{salesRealized.length}</span>
                                </div>
                                {/* <div>
                                    <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Compras realizadas:
                                    </p>
                                    <span className='text-primary-red text-lg font-semibold'>{procurementsRealized.length}</span>
                                </div> */}
                            </div>
                            <div className="flex items-center space-x-4">
                                {!(Number(id) === 0) && user.id === employeeData?.id &&
                                    <IconButton
                                        to={`/employees/edit/${employeeData?.id}`}
                                        label='Editar'
                                        className='w-fit'
                                        icon={Edit}
                                    />
                                }
                                <DeleteEmployeeButton id={employeeData?.id || ""} />
                            </div>
                        </CardContent>
                    </div>
                </Card>
            </Content>
        </PageContainer>
    );
}

function DeleteEmployeeButton({ id }: { id: string; }) {
    const navigate = useNavigate();
    const toast = useToast();

    const user = JSON.parse(sessionStorage.getItem('user') || "");

    async function deleteEmployee(id: string) {
        if (id === user.id) {
            toast({
                title: 'Aviso!',
                colorScheme: 'red',
                description: `Você não pode excluir seus próprios dados.`,
                status: 'warning',
                position: 'top-right',
                isClosable: true,
                duration: 2000,
            });
            return;
        }

        try {
            await http
                .delete(`/employees/${id}`)
                .then(() =>
                    toast({
                        title: 'Sucesso',
                        colorScheme: 'green',
                        description: `Funcionário excluído com sucesso.`,
                        status: 'success',
                        position: 'top-right',
                        isClosable: true,
                        duration: 1500,
                    })
                )
                .then(() => navigate(-1));
        } catch (err) {
            console.error(err);
        }
    }

    if (Number(id) === Number(0)) {
        return;
    }

    if (!user.adm) return;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className='w-[200px] capitalize flex items-center justify-start gap-2 bg-warning-red hover:bg-primary-hover-red'>
                    <Trash2 />
                    Excluir Funcionário
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className='flex items-center justify-between'>
                        <Title variant='h3'>Excluir?</Title>
                        <AlertDialogCancel><X /></AlertDialogCancel>
                    </div>
                </AlertDialogHeader>
                <AlertDialogDescription className='max-h-[300px]'>
                    <span className='text-xl text-black'>
                        Os dados serão excluídos permanentemente. Todas as vendas deste funcionário serão transferidas para o funcionário padrão do sistema</span>
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogAction asChild>
                        <Button
                            className='hover:bg-primary-hover-red'
                            onClick={() => {
                                deleteEmployee(id);
                            }}
                        >
                            Excluir funcionário
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}