import { z } from 'zod';
import { http } from '../../service';
import { LgInput } from '../../components/LgInput';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '../../components/PageContainer';
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Heading,
    useToast,
} from '@chakra-ui/react';

export function Login() {
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState({
        login: 'depois@gmail.com',
        password: '123',
    });

    const navigate = useNavigate();
    const toast = useToast();

    const loginFormSchema = z.object({
        login: z.string().email(),
        password: z.string(),
    });

    const {
        formState: { errors },
        control,
        handleSubmit,
    } = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            login: user.login || '',
            password: user.password || '',
        },
    });

    async function onSubmit(event: any) {
        setLoading(true);
        const credentials = {
            login: event.login,
            password: event.password,
        };
        try {
            await http
                .post('/auth/login', credentials)
                .then((res) => {
                    const JwtToken = res.data.token;
                    sessionStorage.setItem('token', JwtToken);
                })
                .then(() => navigate('/'));
        } catch (error) {
            console.error(error);
            toast({
                title: 'Falha ao realizar login.',
                description: 'Email ou senha incorreto!',
                position: 'top-right',
                status: 'error',
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <PageContainer>
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
        </PageContainer>
    );
}
