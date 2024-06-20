import { http } from '../service';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { UserLogin } from '../types';
import { useNavigate } from 'react-router';

export function useLogin() {
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const toast = useToast();

    async function onSubmit(event: UserLogin) {
        setLoading(true);
        const credentials: UserLogin = {
            email: event.email,
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
                description: 'Algo deu errado!',
                position: 'top-right',
                status: 'error',
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }

    function logOut() {
        sessionStorage.removeItem('token');
        navigate('/login');
    }

    return {
        loading,
        onSubmit,
        logOut,
    };
}
