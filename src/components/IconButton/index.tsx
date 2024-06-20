import { Button } from '@/components/ui/button';
import { twMerge } from 'tailwind-merge';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

interface IconButtonProps {
    to?: string | number | any;
    label: string;
    className?: string;
    icon: LucideIcon;
    labelStyle?: string;
    onClick?: (params?: any) => any;
    iconStyle?: string;
    disabled?: boolean;
}

export function IconButton({
    to = '#',
    label,
    className,
    onClick,
    icon: Icon,
    iconStyle,
    labelStyle,
    disabled = false
}: IconButtonProps) {
    const navigate = useNavigate();

    return (
        <Button
            disabled={disabled}
            className={twMerge('w-full hover:bg-primary-hover-red', className)}
            onClick={() => {
                if (onClick !== undefined) onClick();
                navigate(to);
            }}
        >
            <div className='flex items-center w-full gap-2 justify-evenly'>
                <Icon className={twMerge('size-6', iconStyle)} />
                <span className={twMerge('text-start w-[150px]', labelStyle)}>
                    {label}
                </span>
            </div>
        </Button>
    );
}
