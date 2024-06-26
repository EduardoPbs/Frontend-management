import { Title } from '../../components/Title';
import { Content } from '@/components/Content';
import { useOrder } from '@/hooks/useOrder';
import { useParams } from 'react-router';
import { IconButton } from '../../components/IconButton';
import { OrderEntity } from '@/types/order';
import { useEmployee } from '../../hooks/useEmployee';
import { PageContainer } from '../../components/PageContainer';
import { EmployeeEntity } from '../../types/employee';
import { ArrowLeftCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { primary_red, primary_white } from '../../constants/styles';
import { Box, Divider, AbsoluteCenter } from '@chakra-ui/react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function EmployeeDetail() {
    const [employeeData, setEmployeeData] = useState<EmployeeEntity>();
    const [employeeTransactions, setEmployeeTransactions] = useState<OrderEntity[]>([]);
    const { getEmployeeById } = useEmployee();
    const { getOrderByEmployeeId } = useOrder();
    const { id } = useParams();

    useEffect(() => {
        if (id !== undefined) {
            getEmployeeById(id, setEmployeeData);
            getOrderByEmployeeId(id, setEmployeeTransactions);
        }
    }, []);

    const salesRealized: OrderEntity[] = employeeTransactions.filter((transaction: OrderEntity) => transaction.tipo === "VENDA");
    const procurementsRealized: OrderEntity[] = employeeTransactions.filter((transaction: OrderEntity) => transaction.tipo === "COMPRA");

    return (
        <PageContainer title={`Funcionário - ${id?.slice(0, 8)}`}>
            <IconButton
                to={-1}
                label='Voltar'
                className='w-fit'
                icon={ArrowLeftCircle}
            />

            <Content className='w-full overflow-auto'>
                <Card className='w-full h-fit'>
                    <CardHeader className='flex flex-col justify-center text-2xl font-semibold text-primary-black'>
                        <CardTitle className='bg-slate-200 w-fit px-2 rounded-sm'>
                            <Title>Detalhes</Title>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className='flex flex-col gap-2 m-2 text-primary-black rounded-round-default'>
                        <Box className='flex items-center justify-between'>
                            <p className='capitalize text-lg font-semibold'>
                                Funcionário:{' '}
                                <span className='font-bold text-3xl text-primary-red'>
                                    {employeeData?.nome}
                                </span>
                            </p>
                            <p className='capitalize text-lg font-semibold'>
                                CPF:{' '}
                                <span className='font-bold text-3xl text-primary-red'>
                                    {employeeData?.cpf}
                                </span>
                            </p>
                        </Box>
                        <Box position='relative' marginY={4}>
                            <Divider bg='red' />
                            <AbsoluteCenter
                                bg={primary_red}
                                paddingX={2}
                                borderRadius={3}
                                textColor={primary_white}
                                className='text-md uppercase font-semibold'
                            >
                                Endereço
                            </AbsoluteCenter>
                        </Box>
                        <Box className='flex justify-between'>
                            <p className='capitalize text-lg font-semibold'>
                                Rua:{' '}
                                <span className='font-bold text-3xl text-primary-red'>
                                    {employeeData?.endereco.rua}
                                </span>
                            </p>
                            <p className='capitalize text-lg font-semibold'>
                                Bairro:{' '}
                                <span className='font-bold text-3xl text-primary-red'>
                                    {employeeData?.endereco.bairro}
                                </span>
                            </p>
                            <p className='capitalize text-lg font-semibold'>
                                Número:{' '}
                                <span className='font-bold text-3xl text-primary-red'>
                                    {employeeData?.endereco.number}
                                </span>
                            </p>
                            <p className='capitalize text-lg font-semibold'>
                                Complemento:{' '}
                                <span className='font-bold text-3xl text-primary-red'>
                                    {employeeData?.endereco.complemento}
                                </span>
                            </p>
                        </Box>
                    </CardContent>
                    <CardFooter className='flex flex-col justify-center items-start font-bold uppercase'>
                        <p>Vendas realizadas: <span className='text-xl'>{salesRealized.length}</span></p>
                        <p>Compras realizadas: <span className='text-xl'>{procurementsRealized.length}</span></p>
                    </CardFooter>
                </Card>
            </Content>
        </PageContainer>
    );
}
