import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { IconButton } from '../IconButton';
import { useNavigate } from 'react-router';
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTrigger
} from '@/components/ui/drawer';
import {
    Menu,
    Users,
    Store,
    LogOut,
    Package,
    Settings,
    Package2,
    HomeIcon,
    ShoppingBag,
    PercentCircle,
} from 'lucide-react';
import logo from '../../assets/cloverFlare.jpg';

export function DrawerModal() {
    const navigate = useNavigate();

    return (
        <Drawer direction='left'>
            <DrawerTrigger>
                <Menu className='text-primary-red hover:text-primary-hover-red size-[29px] rounded-[4px] hover:cursor-pointer duration-150' />
            </DrawerTrigger>
            <DrawerContent className='max-w-[300px] h-screen rounded-none px-4 bg-primary-black text-white border-none'>
                <DrawerHeader className='px-0'>
                    <div className='flex items-center gap-2'>
                        <img
                            src={logo}
                            className='size-14 rounded-2xl bg-no-repeat'
                            alt='Clover Flare'
                        />
                        <p>Menu</p>
                    </div>
                </DrawerHeader>
                <div className='flex flex-col justify-center gap-2 mb-2'>
                    <IconButton
                        className='bg-primary-white text-black hover:text-white'
                        to='/'
                        label='Início'
                        icon={HomeIcon}
                    />
                </div>

                <div className='flex flex-col justify-center gap-1'>
                    <span className='uppercase font-semibold text-lg'>
                        Sistema
                    </span>
                    <Separator />
                    <div className='flex flex-col justify-center gap-2'>
                        <IconButton
                            className='bg-primary-white text-black hover:text-white'
                            icon={Package}
                            label='Produtos'
                            to='/products'
                        />
                        <IconButton
                            className='bg-primary-white text-black hover:text-white'
                            icon={ShoppingBag}
                            label='Vendas'
                            to='/orders'
                        />
                        <IconButton
                            className='bg-primary-white text-black hover:text-white'
                            icon={Users}
                            label='Funcionários'
                            to='/employees'
                        />
                        <IconButton
                            className='bg-primary-white text-black hover:text-white'
                            icon={Package2}
                            label='Compras'
                            to='/purchases'
                        />
                        <IconButton
                            className='bg-primary-white text-black hover:text-white'
                            icon={PercentCircle}
                            label='Promoções'
                            to='/promotions'
                        />
                        <IconButton
                            className='bg-primary-white text-black hover:text-white'
                            icon={Store}
                            label='Caixa'
                            to='/cash-register'
                        />
                    </div>
                </div>
                <DrawerFooter className='px-0'>
                    <div className='flex items-center gap-2 w-full'>
                        <Button

                            className='w-full gap-3 bg-primary-white text-black hover:text-white hover:bg-primary-hover-red'
                            onClick={() => {
                                navigate('#');
                            }}
                        >
                            <Settings />
                        </Button>
                        <Button
                            className='w-full gap-3 bg-primary-white text-black hover:text-white hover:bg-primary-hover-red'
                            onClick={() => {
                                sessionStorage.removeItem('token');
                                navigate('/login');
                            }}
                        >
                            <LogOut className='size-6' />
                            Sair
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
