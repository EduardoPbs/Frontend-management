import { http } from '../../service';
import { Title } from '../../components/Title';
import { useParams } from 'react-router';
import { IconButton } from '../../components/IconButton';
import { PageContainer } from '../../components/PageContainer';
import { EmployeeEntity } from '../../constants/employee';
import { ArrowLeftCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    primary_red,
    primary_white,
    primary_hover_red,
} from '../../constants/styles';
import {
    Box,
    Card,
    Divider,
    CardBody,
    CardHeader,
    AbsoluteCenter,
} from '@chakra-ui/react';

export function EmployeeDetail() {
    const [employeeData, setEmployeeData] = useState<EmployeeEntity>();
    const { id } = useParams();

    async function getEmployee(id: string | undefined) {
        try {
            const response = await http.get(`/employees/${id}`);
            setEmployeeData(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (id !== undefined) {
            getEmployee(id);
        }
    }, []);

    return (
        <PageContainer title={`Funcionário - ${id?.slice(0, 8)}`}>
            <IconButton
                to={-1}
                label='Voltar'
                className='w-fit'
                icon={ArrowLeftCircle}
                bgColor={primary_red}
                textColor={primary_white}
                bgHoverColor={primary_hover_red}
            />

            <Box className='flex border-4 border-amber-500 rounded-md'>
                <Card className='w-full h-fit ' background='black'>
                    <CardHeader className='flex flex-col justify-center text-2xl font-semibold text-white'>
                        <Box className='flex items-center justify-between w-full bg-zinc-100/15 rounded-b-md px-1'>
                            <Title>Detalhes</Title>
                        </Box>
                    </CardHeader>

                    <CardBody className='flex flex-col gap-2 m-2 text-white rounded-md'>
                        <Box className='flex items-center justify-between'>
                            <p className='capitalize text-lg font-semibold'>
                                Funcionário:{' '}
                                <span className='font-bold text-3xl text-yellow-400'>
                                    {employeeData?.name}
                                </span>
                            </p>
                            <p className='capitalize text-lg font-semibold'>
                                CPF:{' '}
                                <span className='font-bold text-3xl text-yellow-400'>
                                    {employeeData?.cpf}
                                </span>
                            </p>
                            <p className='capitalize text-lg font-semibold'>
                                ID:{' '}
                                <span className='font-bold text-xl text-yellow-400'>
                                    {employeeData?.id}
                                </span>
                            </p>
                        </Box>

                        <Box position='relative' marginY={4}>
                            <Divider />
                            <AbsoluteCenter
                                bg='yellow.400'
                                paddingX={2}
                                borderRadius={3}
                                textColor='black'
                                className='text-md uppercase font-semibold'
                            >
                                Endereço
                            </AbsoluteCenter>
                        </Box>

                        <Box className='flex justify-between'>
                            <p className='capitalize text-lg font-semibold'>
                                Rua:{' '}
                                <span className='font-bold text-3xl text-yellow-400'>
                                    {employeeData?.address.street}
                                </span>
                            </p>
                            <p className='capitalize text-lg font-semibold'>
                                Bairro:{' '}
                                <span className='font-bold text-3xl text-yellow-400'>
                                    {employeeData?.address.district}
                                </span>
                            </p>
                            <p className='capitalize text-lg font-semibold'>
                                Número:{' '}
                                <span className='font-bold text-3xl text-yellow-400'>
                                    {employeeData?.address.number}
                                </span>
                            </p>
                            <p className='capitalize text-lg font-semibold'>
                                Complemento:{' '}
                                <span className='font-bold text-3xl text-yellow-400'>
                                    {employeeData?.address.complement}
                                </span>
                            </p>
                        </Box>
                    </CardBody>
                </Card>
            </Box>
        </PageContainer>
    );
}
