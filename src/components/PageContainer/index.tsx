import { ArrowUpRightIcon, LogOut, UserCircle2 } from 'lucide-react';
import { DrawerModal } from '../DrawerModal';
import { Title } from '../Title';
import {
    Box,
    Button,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
} from '@chakra-ui/react';

export function PageContainer({
    children,
    title,
}: {
    children: React.ReactNode;
    title?: string;
}) {
    return (
        <main className='flex flex-col justify-start gap-4 bg-black h-screen text-white selection:bg-amber-700 selection:text-white'>
            <header className='flex items-center justify-between gap-4 bg-zinc-800 px-4 py-3'>
                <div className='flex items-center gap-4'>
                    <DrawerModal />

                    <Title>{title}</Title>
                </div>

                <div className='flex items-center gap-1'>
                    <Popover>
                        <PopoverTrigger>
                            <UserCircle2 className='size-9 text-amber-400 hover:text-amber-400/80 hover:cursor-pointer duration-150' />
                        </PopoverTrigger>
                        <PopoverContent width={150}>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverBody>
                                <Box className='flex flex-col justify-center gap-2'>
                                    <Button
                                        className='flex items-center gap-2'
                                        colorScheme='yellow'
                                        height={30}
                                    >
                                        Gerenciar
                                        <ArrowUpRightIcon className='size-6' />
                                    </Button>
                                    <Button
                                        height={30}
                                        colorScheme='orange'
                                        className='flex items-center gap-2'
                                    >
                                        Sair
                                        <LogOut className='size-5' />
                                    </Button>
                                </Box>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                    <a className='hover:cursor-pointer'>Logged Username</a>
                </div>
            </header>

            <section className='flex flex-col gap-4 px-4 py-6 w-full h-fit overflow-hidden'>
                {children}
            </section>
        </main>
    );
}
