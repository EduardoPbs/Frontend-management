import { useNavigate } from 'react-router';

interface LinkProps {
    label: string;
    to: string;
}

export function Link({ label, to }: LinkProps) {
    const navigate = useNavigate();

    return (
        <li
            className='uppercase font-semibold hover:cursor-pointer hover:bg-primary-red px-1 rounded-round-default duration-150'
            onClick={() => navigate(to)}
        >
            {label}
        </li>
    );
}
