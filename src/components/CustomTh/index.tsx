import { Th } from '@chakra-ui/react';

export function CustomTh({ children }: { children: React.ReactNode }) {
    return (
        <Th className='border-x-2'>
            <span className='text-zinc-300 text-lg'>{children}</span>
        </Th>
    );
}
