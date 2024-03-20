import { Box, Button } from '@chakra-ui/react';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { twMerge } from 'tailwind-merge';

interface IconButtonProps {
    to: string;
    label: string;
    icon: LucideIcon;
    onClick?: (params?: any) => any;
    iconStyle?: string;
    colorScheme?: string;
}

export function IconButton({
    to,
    label,
    onClick,
    icon: Icon,
    iconStyle,
    colorScheme = 'yellow',
}: IconButtonProps) {
    const navigate = useNavigate();

    return (
        <Button
            colorScheme={colorScheme}
            className='w-full'
            onClick={() => {
                if (onClick !== undefined) onClick();
                navigate(to);
            }}
        >
            <Box className='flex items-center w-full gap-2 justify-evenly'>
                <Icon className={twMerge('size-7 ', iconStyle)} />
                <span className='text-start w-[150px]'>{label}</span>
            </Box>
        </Button>
    );
}
