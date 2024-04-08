import { ArrowUpRightIcon, LogOut } from 'lucide-react';
import { custom_red, primary_red, primary_white } from '../../constants/styles';
import {
    Box,
    Button,
    Popover,
    PopoverBody,
    PopoverArrow,
    PopoverContent,
    PopoverTrigger,
    Avatar,
} from '@chakra-ui/react';
import cloverF from '../../assets/cloverFlare.jpg';
import { useLogin } from '../../hooks/useLogin';

export function UserPopover() {
    const { logOut } = useLogin();

    return (
        <Box className='flex items-center gap-1 select-none'>
            <Popover>
                <PopoverTrigger>
                    <Avatar
                        bg={primary_red}
                        src={cloverF ?? ''}
                        width={8}
                        height={8}
                        className='hover:cursor-pointer'
                    />
                </PopoverTrigger>
                <PopoverContent width={150}>
                    <PopoverArrow />
                    <PopoverBody backgroundColor='#FBFBFF' borderRadius={8}>
                        <Box className='flex flex-col justify-center gap-2'>
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
                                onClick={() => {
                                    logOut();
                                }}
                            >
                                Sair
                                <LogOut className='size-5' />
                            </Button>
                        </Box>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
            <a className='hover:cursor-pointer font-semibold'>Clover Flare</a>
        </Box>
    );
}
