import { UserCircle2, ArrowUpRightIcon, LogOut } from 'lucide-react';
import { custom_red, primary_red, primary_white } from '../../constants/styles';
import {
    Box,
    Button,
    Popover,
    PopoverBody,
    PopoverArrow,
    PopoverContent,
    PopoverTrigger,
} from '@chakra-ui/react';

export function UserPopover() {
    return (
        <div className='flex items-center gap-1'>
            <Popover>
                <PopoverTrigger>
                    <UserCircle2 className='size-9 text-primary-red hover:text-primary-hover-red hover:cursor-pointer duration-150' />
                </PopoverTrigger>
                <PopoverContent width={150}>
                    <PopoverArrow />
                    <PopoverBody backgroundColor='#FBFBFF' borderRadius={8}>
                        <Box className='flex flex-col justify-center gap-2 '>
                            <Button
                                rounded={6}
                                className='flex items-center gap-2'
                                _hover={{
                                    bg: primary_red,
                                    color: primary_white,
                                }}
                                height={30}
                            >
                                Gerenciar
                                <ArrowUpRightIcon className='size-6' />
                            </Button>
                            <Button
                                height={30}
                                rounded={6}
                                color='#131112'
                                variant='outline'
                                _hover={{
                                    borderColor: custom_red,
                                    color: custom_red,
                                }}
                                className='flex items-center gap-2'
                            >
                                Sair
                                <LogOut className='size-5' />
                            </Button>
                        </Box>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
            <a className='hover:cursor-pointer select-none'>Lorem ipsum dolor sit</a>
        </div>
    );
}
