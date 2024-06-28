import cloverF from '../../assets/cloverFlare.jpg';
import { useLogin } from '../../hooks/useLogin';
import { UserData } from '@/types';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from '@/components/ui/avatar';

export function UserPopover() {
    const [user, setUser] = useState<UserData>();
    const { logOut } = useLogin();

    useEffect(() => {
        if (sessionStorage.getItem('user') !== null) {
            setUser(JSON.parse(sessionStorage.getItem('user') || ""));
        }
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className='flex items-center gap-2 text-sm text-black font-semibold hover:cursor-pointer'>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <Avatar className='border-2 border-primary-red select-none'>
                            <AvatarImage src={cloverF ?? ''} alt='Clover Flare' />
                        </Avatar>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                    <p className='text-primary-white'>{user?.name}</p>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className='cursor-pointer'>
                    Minha Conta
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer'>
                    <a href="/settings">Configurações</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href="#">Suporte</a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className='cursor-pointer'>
                    <Button onClick={logOut} variant='ghost' className='w-full'>
                        Sair
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
