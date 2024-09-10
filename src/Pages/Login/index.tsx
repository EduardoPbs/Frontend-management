import { z } from 'zod';
import { Button } from '@chakra-ui/react';
import { LgInput } from '../../components/LgInput';
import { useForm } from 'react-hook-form';
import { useLogin } from '../../hooks/useLogin';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { primary_black, primary_hover_red, primary_white } from '@/constants/styles';

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
            email: 'eduardo@hotmail.com',
            password: '123',
        },
    });

    useEffect(() => {
        document.title = 'Management | Login';
    }, []);

    return (
        <section className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-full">
            <div className="hidden min-h-screen bg-primary-black lg:block" />

            <div className="flex items-start justify-center py-52">
                <form className="border-2 py-4 px-6 rounded-md  mx-auto grid w-[400px] gap-3" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">LogIn</h1>
                    </div>
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
                        backgroundColor={primary_black}
                        isLoading={loading}
                        loadingText='Carregando...'
                        borderRadius={4}
                        type='submit'
                    >
                        Entrar
                    </Button>
                </form>
            </div >
        </section >
    );
}
