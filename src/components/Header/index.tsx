import { Link } from '../NavLinks/Link';
import { Title } from '../Title';
import { NavLink } from '../NavLinks';
import { DrawerModal } from '../DrawerModal';
import { UserPopover } from '../UserPopover';
import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu';

interface HeaderProps {
    title?: string;
}

export function Header({ title }: HeaderProps) {
    return (
        <header className='flex items-center sm:justify-between gap-4 bg-primary-black px-4 py-3 shadow-md shadow-gray-400/80'>
            <div className='flex flex-none items-end justify-start gap-4'>
                <DrawerModal />

                <div className='min-w-[180px]'>
                    <Title variant='h2'>{title}</Title>
                </div>
            </div>

            <div className='flex w-full h-full xl:justify-between justify-end xl:items-center gap-1'>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavLink>
                            <Link label='Início' to='/' />
                            <Link label='Produtos' to='/products' />
                            <Link label='Compras' to='/purchases' />
                            <Link label='Vendas' to='/orders' />
                            <Link label='Funcionários' to='/employees' />
                            <Link label='Caixa' to='/cash-register' />
                            <Link label='Promoções' to='/promotions' />
                        </NavLink>
                    </NavigationMenuList>
                </NavigationMenu>

                <UserPopover />
            </div>
        </header>
    );
}
