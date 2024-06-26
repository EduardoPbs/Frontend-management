import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useLogin } from '../../hooks/useLogin';
import { AvatarImage } from '@radix-ui/react-avatar';
import { ArrowUpRightIcon, LogOut } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import cloverF from '../../assets/cloverFlare.jpg';

export function UserPopover() {
    const { logOut } = useLogin();
    const user = JSON.parse(sessionStorage.getItem('user') || "");

    return (
        <div className='flex items-center gap-1.5 select-none'>
            <Popover>
                <PopoverTrigger>
                    <Avatar className='hover:cursor-pointer size-8 rounded-lg'>
                        <AvatarImage src={cloverF ?? ''} alt='Clover Flare' />
                    </Avatar>
                </PopoverTrigger>
                <PopoverContent className='relative mt-2'>
                    <div className='absolute top-0 right-[116px] -mt-2 rotate-45 size-4 bg-slate-100' />
                    <div className='flex flex-col justify-center gap-2'>
                        <Button
                            className='flex items-center gap-2 hover:bg-primary-hover-red'
                        >
                            Gerenciar
                            <ArrowUpRightIcon className='size-5' />
                        </Button>
                        <Button
                            className='flex items-center gap-2 hover:bg-primary-hover-red'
                            onClick={() => {
                                logOut();
                            }}
                        >
                            Sair
                            <LogOut className='size-5' />
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
            <a className='hover:cursor-pointer font-semibold'>{user?.name || ''}</a>
        </div>
    );
}
