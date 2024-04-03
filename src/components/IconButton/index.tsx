import { twMerge } from 'tailwind-merge';
import { LucideIcon } from 'lucide-react';
import { Box, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import {
    primary_red,
    round_default,
    primary_black,
    primary_white,
} from '../../constants/styles';

interface IconButtonProps {
    to?: string | number | any;
    label: string;
    className?: string;
    icon: LucideIcon;
    labelStyle?: string;
    onClick?: (params?: any) => any;
    iconStyle?: string;
    bgColor?: string;
    textColor?: string;
    textHoverColor?: string;
    bgHoverColor?: string;
    rounded?: string;
}

export function IconButton({
    to = '#',
    label,
    className,
    onClick,
    icon: Icon,
    iconStyle,
    labelStyle,
    bgColor = primary_white,
    textColor = primary_black,
    textHoverColor = primary_white,
    bgHoverColor = primary_red,
    rounded = round_default,
}: IconButtonProps) {
    const navigate = useNavigate();

    return (
        <Button
            rounded={rounded}
            backgroundColor={bgColor}
            color={textColor}
            _hover={{ bg: bgHoverColor, color: textHoverColor }}
            className={twMerge('w-full', className)}
            onClick={() => {
                if (onClick !== undefined) onClick();
                navigate(to);
            }}
        >
            <Box className='flex items-center w-full gap-2 justify-evenly'>
                <Icon className={twMerge('size-7 ', iconStyle)} />
                <span className={twMerge('text-start w-[150px]', labelStyle)}>
                    {label}
                </span>
            </Box>
        </Button>
    );
}
