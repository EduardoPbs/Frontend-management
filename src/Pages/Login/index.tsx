import { z } from 'zod';
import { LgInput } from '../../components/LgInput';
import { useForm } from 'react-hook-form';
import { useLogin } from '../../hooks/useLogin';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Heading,
} from '@chakra-ui/react';

export function Login() {
    const { loading, onSubmit } = useLogin();

    const loginFormSchema = z.object({
        login: z.string().email({ message: 'Email inválido!' }),
        password: z.string({
            required_error: 'Senha obrigatória!',
        }),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            login: 'depois@gmail.com',
            password: '123',
        },
    });

    useEffect(() => {
        document.title = 'Management | Login';
    }, []);

    return (
        <section className='flex flex-col justify-start gap-4 px-4 py-6 bg-black h-screen text-white selection:bg-amber-700 selection:text-white'>
            <Box className='flex items-center w-full h-full justify-center'>
                <Box className='w-[500px]'>
                    <Card>
                        <CardHeader>
                            <Heading size='md'>Entrar</Heading>
                        </CardHeader>
                        <CardBody>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className='flex flex-col gap-4 w-full'
                            >
                                <LgInput
                                    label='Usuário'
                                    type='email'
                                    name='login'
                                    placeholder='example@email.com'
                                    errors={errors.login}
                                    control={control}
                                    autoComplete='disabled'
                                />
                                <LgInput
                                    label='Senha'
                                    type='password'
                                    name='password'
                                    placeholder='******'
                                    errors={errors.password}
                                    control={control}
                                    autoComplete='disabled'
                                />
                                <Button
                                    isLoading={loading}
                                    loadingText='Carregando...'
                                    colorScheme='yellow'
                                    type='submit'
                                >
                                    Entrar
                                </Button>
                            </form>
                        </CardBody>
                    </Card>
                </Box>
            </Box>
        </section>
    );
}
