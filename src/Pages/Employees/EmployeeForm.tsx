import { z } from 'zod';
import { http } from '../../service';
import { LgInput } from '../../components/LgInput';
import { useForm } from 'react-hook-form';
import { IconButton } from '../../components/IconButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '../../components/PageContainer';
import { EmployeeEntity } from '../../types/employee';
import { ArrowLeftCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
    primary_red,
    primary_white,
    primary_hover_red,
} from '../../constants/styles';
import {
    Box,
    Button,
    Divider,
    useToast,
    AbsoluteCenter,
} from '@chakra-ui/react';

export function EmployeeForm() {
    const [employeeData, setEmployeeData] = useState<Partial<EmployeeEntity>>({
        name: '',
        cpf: '',
        address: {
            street: '',
            district: '',
            number: '',
            complement: '',
        },
    });
    const navigate = useNavigate();
    const toast = useToast();
    const { id } = useParams();

    const EmployeeFormSchema = z.object({
        name: z
            .string({ required_error: 'Obrigatório.' })
            .min(3, { message: 'Deve conter pelo menos 3 caracteres.' }),
        cpf: z
            .string({ required_error: 'Obrigatório.' })
            .min(11, { message: 'Deve conter 11 caracteres.' })
            .max(11, { message: 'Deve conter 11 caracteres.' }),
        street: z
            .string({ required_error: 'Obrigatório.' })
            .min(3, { message: 'Deve conter pelo menos 3 caracteres.' }),
        district: z
            .string({ required_error: 'Obrigatório.' })
            .min(3, { message: 'Deve conter pelo menos 3 caracteres.' }),
        number: z.string().optional(),
        complement: z.string().optional(),
    });

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(EmployeeFormSchema),
        defaultValues: {
            name: employeeData.name || '',
            cpf: employeeData.cpf || '',
            street: employeeData.address?.street || '',
            number: employeeData.address?.number || '',
            district: employeeData.address?.district || '',
            complement: employeeData.address?.complement || '',
        },
    });

    async function dataEmployeeToUpdate(id: string | undefined) {
        try {
            const response = await http.get(`/employees/${id}`);
            setEmployeeData({
                name: response.data.name,
                cpf: response.data.cpf,
                address: {
                    street: response.data.address.street,
                    district: response.data.address.district,
                    number: response.data.address.number,
                    complement: response.data.address.complement,
                },
            });

            reset({
                name: response.data.name,
                cpf: response.data.cpf,
                street: response.data.address.street,
                district: response.data.address.district,
                number: response.data.address.number,
                complement: response.data.address.complement,
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function updateEmployee(
        id: string | undefined,
        data: Partial<EmployeeEntity>
    ) {
        try {
            await http
                .put(`/employees/${id}`, data)
                .then((res) => console.log('GET ONE: ', res.data))
                .then(() =>
                    toast({
                        title: 'Sucesso',
                        colorScheme: 'cyan',
                        description: `O funcionário foi atualizado.`,
                        status: 'success',
                        position: 'top-right',
                        isClosable: true,
                        duration: 2000,
                    })
                )
                .then(() => navigate(-1));
        } catch (err) {
            console.error(err);
        }
    }

    async function createEmployee(data: Partial<EmployeeEntity>) {
        try {
            await http
                .post('/employees', data)
                .then((res) => console.log(res.data))
                .then(() =>
                    toast({
                        title: 'Sucesso',
                        colorScheme: 'cyan',
                        description: `O funcionário foi cadastrado.`,
                        status: 'success',
                        position: 'top-right',
                        isClosable: true,
                        duration: 2000,
                    })
                )
                .then(() => navigate(-1));
        } catch (err) {
            console.error(err);
        }
    }

    async function onSubmit(event: any) {
        const employee: Partial<EmployeeEntity> = {
            name: event.name,
            cpf: event.cpf,
            address: {
                street: event.street,
                district: event.district,
                number: event.number,
                complement: event.complement,
            },
        };
        try {
            id ? updateEmployee(id, employee) : createEmployee(employee);
        } catch (error: any) {
            toast({
                title: 'Erro',
                description: `Falha ao cadastrar o funcionário: ${error.response?.data?.message}`,
                status: 'error',
                position: 'top-right',
                isClosable: true,
                duration: 3000,
            });
        }
    }

    useEffect(() => {
        if (id !== undefined) {
            dataEmployeeToUpdate(id);
        }
    }, []);

    return (
        <PageContainer title={id ? 'Atualizar' : 'Cadastro'}>
            <IconButton
                to={-1}
                label='Voltar'
                className='w-fit'
                icon={ArrowLeftCircle}
                bgColor={primary_red}
                textColor={primary_white}
                bgHoverColor={primary_hover_red}
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <Box className='flex flex-col gap-4 border-4 px-4 py-2 border-amber-500 rounded-md'>
                    <div className='flex items-center w-full gap-4'>
                        <LgInput
                            label='Nome'
                            name='name'
                            placeholder='Luci'
                            errors={errors.name}
                            control={control}
                            autoComplete='disabled'
                        />
                        <LgInput
                            label='CPF'
                            name='cpf'
                            placeholder='xxx.xxx.xxx-xx'
                            errors={errors.cpf}
                            control={control}
                            autoComplete='disabled'
                        />
                    </div>

                    <Box position='relative' marginTop={4}>
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

                    <div className='flex items-center w-full gap-4'>
                        <LgInput
                            label='Rua'
                            name='street'
                            placeholder='Rua A'
                            errors={errors.street}
                            control={control}
                            autoComplete='disabled'
                        />
                        <LgInput
                            label='Bairro'
                            name='district'
                            placeholder='Jardim Paraná'
                            errors={errors.district}
                            control={control}
                            autoComplete='disabled'
                        />
                        <LgInput
                            label='Número'
                            name='number'
                            placeholder='123'
                            errors={errors.number}
                            control={control}
                            autoComplete='disabled'
                        />
                        <LgInput
                            label='Complemento'
                            name='complement'
                            placeholder='Casa'
                            errors={errors.complement}
                            control={control}
                            autoComplete='disabled'
                        />
                    </div>
                    <Button colorScheme='yellow' type='submit'>
                        {id ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                </Box>
            </form>
        </PageContainer>
    );
}
