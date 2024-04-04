import { useRef } from 'react';
import { IconButton } from '../IconButton';
import { useNavigate } from 'react-router';
import {
    Box,
    Button,
    Drawer,
    Divider,
    Tooltip,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    useDisclosure,
    DrawerCloseButton,
} from '@chakra-ui/react';
import {
    Menu,
    Users,
    Store,
    LogOut,
    Package,
    Settings,
    Package2,
    HomeIcon,
    ShoppingBag,
    PercentCircle,
} from 'lucide-react';
import { custom_red, primary_red } from '../../constants/styles';

export function DrawerModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const btnRef = useRef();

    return (
        <>
            <Menu
                className='text-primary-red hover:text-primary-hover-red size-10 rounded-[4px] hover:cursor-pointer duration-150'
                onClick={onOpen}
            />

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />

                <DrawerContent color='#F7F7FF' bg='#131112'>
                    <DrawerCloseButton _hover={{ color: '#F40000' }} />

                    <DrawerHeader className='select-none'>Painel</DrawerHeader>

                    <Divider />

                    <DrawerBody className='flex flex-col gap-4 my-4'>
                        <div className='flex flex-col justify-center gap-2'>
                            <IconButton to='/' label='Início' icon={HomeIcon} />
                        </div>

                        <div className='flex flex-col justify-center gap-2'>
                            <span className='uppercase font-semibold text-lg'>
                                Sistema
                            </span>
                            <Divider />
                            <div className='flex flex-col justify-center gap-4'>
                                <IconButton
                                    icon={Package}
                                    label='Produtos'
                                    to='/products'
                                />
                                <IconButton
                                    icon={ShoppingBag}
                                    label='Vendas'
                                    to='/orders'
                                />
                                <IconButton
                                    icon={Users}
                                    label='Funcionários'
                                    to='/employees'
                                />
                                <IconButton
                                    icon={Package2}
                                    label='Compras'
                                    to='/purchases'
                                />
                                <IconButton
                                    icon={PercentCircle}
                                    label='Promoções'
                                    to='#'
                                />
                                <IconButton
                                    icon={Store}
                                    label='Caixa'
                                    to='/cash-register'
                                />
                            </div>
                        </div>
                    </DrawerBody>
                    <DrawerFooter>
                        <Box className='flex items-center gap-2 w-full'>
                            <Tooltip label='Ir para configurações'>
                                <Button
                                    rounded={6}
                                    _hover={{
                                        bg: primary_red,
                                        color: '#F7F7FF',
                                    }}
                                    className='w-full gap-3'
                                    onClick={() => {
                                        navigate('#');
                                    }}
                                >
                                    <Settings />
                                </Button>
                            </Tooltip>
                            <Button
                                variant='outline'
                                _hover={{
                                    borderColor: custom_red,
                                    color: custom_red,
                                }}
                                _active={{ bg: 'transparent' }}
                                color='white'
                                onClick={() => {
                                    sessionStorage.removeItem('token');
                                    navigate('/login');
                                }}
                                className='flex item-center w-full gap-2'
                            >
                                <LogOut className='size-6' />
                                Sair
                            </Button>
                        </Box>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}
