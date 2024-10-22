import { NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { useNavigate } from 'react-router';

interface LinkProps {
    label: string;
    to: string;
}

export function Link({ label, to }: LinkProps) {
    const navigate = useNavigate();

    return (
        <NavigationMenuItem>
            <p
                className='uppercase font-semibold hover:cursor-pointer hover:bg-primary-white/20 px-2 py-1 rounded-sm duration-150'
                onClick={() => { navigate(to); }}
            >
                <NavigationMenuLink>
                    {label}
                </NavigationMenuLink>
            </p>
        </NavigationMenuItem>
    );
}
