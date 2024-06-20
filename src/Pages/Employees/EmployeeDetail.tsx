import { Title } from '../../components/Title';
import { Content } from '@/components/Content';
import { useParams } from 'react-router';
import { IconButton } from '../../components/IconButton';
import { useEmployee } from '../../hooks/useEmployee';
import { PageContainer } from '../../components/PageContainer';
import { EmployeeEntity } from '../../types/employee';
import { ArrowLeftCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { primary_red, primary_white } from '../../constants/styles';
import { Box, Card, Divider, CardBody, CardHeader, AbsoluteCenter } from '@chakra-ui/react';

export function EmployeeDetail() {
    const [employeeData, setEmployeeData] = useState<EmployeeEntity>();
    const { getEmployeeById } = useEmployee();
    const { id } = useParams();

    useEffect(() => {
        if (id !== undefined) {
            getEmployeeById(id, setEmployeeData);
        }
    }, []);

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
                        <Box className='flex items-center justify-between w-full bg-slate-200 rounded-sm px-1'>
                            <Title>Detalhes</Title>
                        </Box>
                    </CardHeader>

                    <CardBody className='flex flex-col gap-2 m-2 text-primary-black rounded-round-default'>
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
                    </CardBody>
                </Card>
            </Content>
        </PageContainer>
    );
}
