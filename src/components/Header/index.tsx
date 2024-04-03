import { Link } from '../NavLinks/Link';
import { Title } from '../Title';
import { NavLink } from '../NavLinks';
import { DrawerModal } from '../DrawerModal';
import { UserPopover } from '../UserPopover';

interface HeaderProps {
    title?: string;
}

export function Header({ title }: HeaderProps) {
    return (
        <header className='flex items-center justify-between gap-4 bg-primary-black px-4 py-3 shadow-md shadow-gray-400/80'>
            <div className='flex items-end gap-4 min-w-60'>
                <DrawerModal />

                <Title variant='h2'>{title}</Title>
            </div>

            <div className='flex w-full h-full justify-between items-center gap-1'>
                <NavLink>
                    <Link label='Início' to='/' />
                    <Link label='Produtos' to='/products' />
                    <Link label='Compras' to='/purchases' />
                    <Link label='Vendas' to='/orders' />
                    <Link label='Funcionários' to='/employees' />
                    <Link label='Caixa' to='/cash-register' />
                    <Link label='Promoções' to='/promos' />
                </NavLink>

                <UserPopover />
            </div>
        </header>
    );
}
