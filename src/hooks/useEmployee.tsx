import { useToast } from '@chakra-ui/react';
import { http } from '../service';
import { EmployeeEntity } from '../types/employee';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod';

export function useEmployee() {
    const [dataEmployees, setDataEmployees] = useState<EmployeeEntity[]>([]);

    const navigate = useNavigate();
    const toast = useToast();

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
        numero: z.string().optional(),
        complemento: z.string().optional(),
        email: z
            .string({ required_error: 'Obrigatório.' })
            .email({ message: 'Email inválido.' }),
        password: z.preprocess(
            (val) => val === '' ? undefined : val,
            z
                .string()
                .min(4, { message: 'Deve conter pelo menos 4 caracteres.' })
                .optional()
        ),
    });

    async function getDataEmployees() {
        try {
            const response = await http.get<EmployeeEntity[]>('/employees');
            if (!response.data) return;
            setDataEmployees(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function getEmployeeById(
        id: string,
        setDataEmployee: (data: EmployeeEntity) => void
    ) {
        try {
            const response = await http.get(`/employees/${id}`);
            const employeeFounded = response.data;
            setDataEmployee(employeeFounded);
        } catch (error) {
            console.error(error);
        }
    }

    async function dataEmployeeToUpdate(id: string | undefined, setEmployeeData: (state: any) => void, reset: any) {
        try {
            const response = await http.get(`/employees/${id}`);
            setEmployeeData({
                nome: response.data.nome,
                cpf: response.data.cpf,
                endereco: {
                    rua: response.data.endereco.rua,
                    bairro: response.data.endereco.bairro,
                    numero: response.data.endereco.numero,
                    complemento: response.data.endereco.complemento,
                },
                usuario: {
                    email: response.data.usuario.email,
                    password: response.data.usuario.password,
                    is_admin: response.data.usuario.is_admin
                },
            });

            reset({
                nome: response.data.nome,
                cpf: response.data.cpf,
                rua: response.data.endereco.rua,
                bairro: response.data.endereco.bairro,
                numero: response.data.endereco.numero,
                complemento: response.data.endereco.complemento,
                email: response.data.usuario.email,
                password: response.data.usuario.password,
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function createEmployee(data: Partial<EmployeeEntity>) {
        const employee = {
            nome: data.nome,
            cpf: data.cpf,
            endereco: {
                rua: data.endereco?.rua,
                bairro: data.endereco?.bairro,
                numero: data.endereco?.numero,
                complemento: data.endereco?.complemento,
            },
            usuario: {
                email: data.usuario?.email,
                password: data.usuario?.password,
                is_admin: false
            }
        };

        try {
            await http
                .post('/employees', employee)
                .then((res) => console.log(res.data))
                .then(() =>
                    toast({
                        title: 'Sucesso',
                        colorScheme: 'green',
                        description: 'O funcionário foi cadastrado.',
                        status: 'success',
                        position: 'top-right',
                        isClosable: true,
                        duration: 2000,
                    })
                )
                .then(() => navigate(-1));
        } catch (err: any) {
            console.error(err.response.data);
            const errorMessage = err.response.data.errors[0].defaultMessage;
            toast({
                title: 'Erro!',
                colorScheme: 'red',
                description: errorMessage,
                status: 'warning',
                position: 'top-right',
                isClosable: true,
                duration: 2000,
            });
        }
    }

    async function updateEmployee(
        id: string | undefined,
        data: Partial<EmployeeEntity>
    ) {
        const updatedData = {
            nome: data.nome,
            cpf: data.cpf,
            endereco: {
                rua: data.endereco?.rua,
                bairro: data.endereco?.bairro,
                numero: data.endereco?.numero,
                complemento: data.endereco?.complemento,
            },
            usuario: {
                email: data.usuario?.email,
                password: data.usuario?.password,
                id_admin: data.usuario?.is_admin
            }
        };

        if (data.usuario?.password === undefined || data.usuario?.password.length < 1) {
            delete updatedData.usuario.password;
        }

        try {
            await http
                .put(`/employees/${id}`, updatedData)
                .then((res) => console.log('GET ONE: ', res.data))
                .then(() => {
                    toast({
                        title: 'Sucesso',
                        colorScheme: 'green',
                        description: `O funcionário foi atualizado.`,
                        status: 'success',
                        position: 'top-right',
                        isClosable: true,
                        duration: 2000,
                    });
                }
                )
                .then(() => navigate(-1));
        } catch (err) {
            console.error(err);
        }
    }

    async function onSubmit(id: string | undefined, event: any) {
        const employee: Omit<Partial<EmployeeEntity>, "is_admin"> = {
            nome: event.nome,
            cpf: event.cpf,
            endereco: {
                rua: event.rua,
                bairro: event.bairro,
                numero: event.numero,
                complemento: event.complemento,
            },
            usuario: {
                email: event.email,
                password: event.password
            }
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
        getDataEmployees();
    }, []);

    return {
        dataEmployees,
        getEmployeeById,
        dataEmployeeToUpdate,
        onSubmit,
        EmployeeFormSchema
    };
}
