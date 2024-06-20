import { z } from 'zod';
import { LgInput } from '../../components/LgInput';
import { useForm } from 'react-hook-form';
import { useLogin } from '../../hooks/useLogin';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Heading } from '@chakra-ui/react';
import {
    primary_red,
    primary_white,
    primary_hover_red,
} from '../../constants/styles';

export function Login() {
    const { loading, onSubmit } = useLogin();

    const loginFormSchema = z.object({
        email: z.string().email({ message: 'Email inválido!' }),
        password: z.string().min(1, { message: 'Senha obrigatória.' }),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: 'depois@gmail.com',
            password: '123',
        },
    });

    useEffect(() => {
        document.title = 'Management | Login';
    }, []);

    return (
        <section className='flex flex-col justify-center gap-4 px-4 py-6 bg-primary-white h-screen text-white selection:bg-primary-red selection:text-white'>
            <Box className='flex items-center justify-center w-full h-full'>
                <Box className='flex flex-col justify-between w-[500px] gap-4 bg-slate-950 rounded-round-default px-8 py-6 shadow-lg shadow-border-gray'>
                    <Heading color={primary_white} size='md'>
                        LogIn
                    </Heading>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-4 w-full font-semibold select-none '
                    >
                        <LgInput
                            label='Usuário'
                            type='email'
                            name='email'
                            placeholder='example@email.com'
                            errors={errors.email}
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
                            rounded={6}
                            _hover={{
                                bg: primary_hover_red,
                            }}
                            color={primary_white}
                            backgroundColor={primary_red}
                            isLoading={loading}
                            loadingText='Carregando...'
                            type='submit'
                        >
                            Entrar
                        </Button>
                    </form>
                </Box>
            </Box>
        </section>
    );
}
