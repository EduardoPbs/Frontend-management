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
import { primary_red, primary_white } from '../../constants/styles';
import {
    Box,
    Divider,
    useToast,
    AbsoluteCenter,
} from '@chakra-ui/react';
import { Button } from '@/components/ui/button';

export function EmployeeForm() {
    const [employeeData, setEmployeeData] = useState<Partial<EmployeeEntity>>({
        nome: '',
        cpf: '',
        endereco: {
            rua: '',
            bairro: '',
            number: '',
            complemento: '',
        },
    });
    const navigate = useNavigate();
    const toast = useToast();
    const { id } = useParams();

    const EmployeeFormSchema = z.object({
        nome: z
            .string({ required_error: 'Obrigatório.' })
            .min(3, { message: 'Deve conter pelo menos 3 caracteres.' }),
        cpf: z
            .string({ required_error: 'Obrigatório.' })
            .min(11, { message: 'Deve conter 11 caracteres.' })
            .max(11, { message: 'Deve conter 11 caracteres.' }),
        rua: z
            .string({ required_error: 'Obrigatório.' })
            .min(3, { message: 'Deve conter pelo menos 3 caracteres.' }),
        bairro: z
            .string({ required_error: 'Obrigatório.' })
            .min(3, { message: 'Deve conter pelo menos 3 caracteres.' }),
        number: z.string().optional(),
        complemento: z.string().optional(),
    });

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(EmployeeFormSchema),
        defaultValues: {
            nome: employeeData.nome || '',
            cpf: employeeData.cpf || '',
            rua: employeeData.endereco?.rua || '',
            number: employeeData.endereco?.number || '',
            bairro: employeeData.endereco?.bairro || '',
            complemento: employeeData.endereco?.complemento || '',
        },
    });

    async function dataEmployeeToUpdate(id: string | undefined) {
        try {
            const response = await http.get(`/employees/${id}`);
            setEmployeeData({
                nome: response.data.nome,
                cpf: response.data.cpf,
                endereco: {
                    rua: response.data.endereco.rua,
                    bairro: response.data.endereco.bairro,
                    number: response.data.endereco.number,
                    complemento: response.data.endereco.complemento,
                },
            });

            reset({
                nome: response.data.nome,
                cpf: response.data.cpf,
                rua: response.data.endereco.rua,
                bairro: response.data.endereco.bairro,
                number: response.data.endereco.number,
                complemento: response.data.endereco.complemento,
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
            nome: event.nome,
            cpf: event.cpf,
            endereco: {
                rua: event.rua,
                bairro: event.bairro,
                number: event.number,
                complemento: event.complemento,
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
            />

            <form
                className='flex flex-col gap-4'
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className='flex items-center w-full gap-5'>
                    <LgInput
                        label='Nome'
                        name='nome'
                        placeholder='Luci'
                        errors={errors.nome}
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
                        bg={primary_red}
                        paddingX={2}
                        borderRadius={3}
                        textColor={primary_white}
                        className='text-md uppercase font-semibold'
                    >
                        Endereço
                    </AbsoluteCenter>
                </Box>

                <div className='flex items-center w-full gap-4'>
                    <LgInput
                        label='Rua'
                        name='rua'
                        placeholder='Rua A'
                        errors={errors.rua}
                        control={control}
                        autoComplete='disabled'
                    />
                    <LgInput
                        label='Bairro'
                        name='bairro'
                        placeholder='Jardim Paraná'
                        errors={errors.bairro}
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
                        name='complemento'
                        placeholder='Casa'
                        errors={errors.complemento}
                        control={control}
                        autoComplete='disabled'
                    />
                </div>
                <Button
                    className='w-full hover:bg-primary-hover-red'
                    type='submit'
                >
                    {id ? 'Atualizar' : 'Cadastrar'}
                </Button>
            </form>
        </PageContainer>
    );
}
