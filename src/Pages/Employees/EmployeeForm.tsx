import { Button } from '@/components/ui/button';
import { Content } from '@/components/Content';
import { LgInput } from '../../components/LgInput';
import { useForm } from 'react-hook-form';
import { IconButton } from '../../components/IconButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '../../components/PageContainer';
import { EmployeeEntity } from '../../types/employee';
import { ArrowLeftCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmployee } from '@/hooks/useEmployee';

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
        usuario: {
            email: '',
            password: ''
        }
    });
    const { id } = useParams();
    const { EmployeeFormSchema, dataEmployeeToUpdate, onSubmit } = useEmployee();

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
            email: employeeData.usuario?.email || '',
            password: employeeData.usuario?.password || ''
        },
    });

    function handlerFormSubmit(event: any) {
        onSubmit(id, event);
    }

    useEffect(() => {
        if (id !== undefined) {
            dataEmployeeToUpdate(id, setEmployeeData, reset);
        }
    }, []);

    console.log(employeeData);

    return (
        <PageContainer title={id ? 'Atualizar' : 'Cadastro'}>
            <IconButton
                to={-1}
                label='Voltar'
                className='w-fit'
                icon={ArrowLeftCircle}
            />
            <Content className='w-full flex items-center overflow-auto'>
                <Card className="bg-white dark:bg-gray-900 w-[600px]">
                    <div className="max-w-2xl p-4 py-1 mx-auto">
                        <CardHeader className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                            <CardTitle>
                                Dados de Funcionário/Usuário
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(handlerFormSubmit)}>
                                <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                                    <div className="w-full">
                                        <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                            Name:
                                        </p>
                                        <LgInput
                                            name='nome'
                                            placeholder='Batman'
                                            errors={errors.nome}
                                            control={control}
                                            autoComplete='disabled'
                                        />
                                    </div>
                                    <div className="w-full">
                                        <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                            CPF:
                                        </p>
                                        <LgInput
                                            name='cpf'
                                            placeholder='xxx.xxx.xxx-xx'
                                            errors={errors.cpf}
                                            control={control}
                                            autoComplete='disabled'
                                        />
                                    </div>
                                    <div className="w-full">
                                        <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                            Rua:
                                        </p>
                                        <LgInput
                                            name='rua'
                                            placeholder='Rua A'
                                            errors={errors.rua}
                                            control={control}
                                            autoComplete='disabled'
                                        />
                                    </div>
                                    <div>
                                        <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                            Bairro:
                                        </p>
                                        <LgInput
                                            name='bairro'
                                            placeholder='Jardim Paraná'
                                            errors={errors.bairro}
                                            control={control}
                                            autoComplete='disabled'
                                        />
                                    </div>
                                    <div>
                                        <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                            Número:
                                        </p>
                                        <LgInput
                                            name='number'
                                            placeholder='123'
                                            errors={errors.number}
                                            control={control}
                                            autoComplete='disabled'
                                        />
                                    </div>
                                    <div>
                                        <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                            Complemento:
                                        </p>
                                        <LgInput
                                            name='complemento'
                                            placeholder='Casa'
                                            errors={errors.complemento}
                                            control={control}
                                            autoComplete='disabled'
                                        />
                                    </div>
                                    <div className={id !== undefined ? 'col-span-2' : ''}>
                                        <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                            Email:
                                        </p>
                                        <LgInput
                                            disabled={id !== undefined}
                                            name='email'
                                            placeholder='example@email.com'
                                            errors={errors.email}
                                            control={control}
                                            autoComplete='disabled'
                                        />
                                    </div>
                                    <div className={id === undefined ? 'block' : 'hidden'}>
                                        <p className="block text-sm font-medium text-gray-900 dark:text-white">
                                            Senha:
                                        </p>
                                        <LgInput
                                            disabled={id !== undefined}
                                            name='password'
                                            placeholder='****'
                                            type='password'
                                            errors={errors.password}
                                            control={control}
                                            autoComplete='disabled'
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Button
                                        className='w-full hover:bg-primary-hover-red'
                                        type='submit'
                                    >
                                        {id ? 'Atualizar' : 'Cadastrar'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </div>
                </Card>
            </Content>
        </PageContainer>
    );
}
