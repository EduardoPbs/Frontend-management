import { twMerge } from 'tailwind-merge';
import { LucideIcon } from 'lucide-react';

export function Button({
    children,
    icon: Icon,
    onClick,
    className = '',
}: {
    children: React.ReactNode;
    icon: LucideIcon;
    onClick?: (event: any) => any;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={twMerge(
                'flex items-center justify-center px-6 gap-1 text-gray-950 hover:text-white uppercase font-bold text-lg rounded-[4px] h-[45px] min-w-[100px] w-[270px] max-w-full bg-amber-400 hover:bg-amber-600 duration-200',
                className
            )}
        >
            <Icon size={20} />
            {children}
        </button>
    );
}
