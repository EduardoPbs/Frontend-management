import { Th } from '@chakra-ui/react';
import { twMerge } from 'tailwind-merge';
import { border_gray } from '../../constants/styles';

interface CustomThProps {
    children: React.ReactNode;
    outStyle?: string;
    inStyle?: string;
}

export function CustomTh({ children, outStyle, inStyle }: CustomThProps) {
    return (
        <Th
            borderColor={border_gray}
            className={twMerge('bg-light-gray border-r-[3px]', outStyle)}
        >
            <span className={twMerge('text-primary-black text-lg', inStyle)}>
                {children}
            </span>
        </Th>
    );
}
