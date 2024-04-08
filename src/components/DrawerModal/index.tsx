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
import {
    custom_red,
    primary_black,
    primary_red,
    primary_white,
    round_default,
} from '../../constants/styles';
import logo from '../../assets/cloverFlare.jpg';

export function DrawerModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const btnRef = useRef();

    return (
        <>
            <Menu
                className='text-primary-red hover:text-primary-hover-red size-[29px] rounded-[4px] hover:cursor-pointer duration-150'
                onClick={onOpen}
            />

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />

                <DrawerContent color={primary_white} bg={primary_black}>
                    <DrawerCloseButton _hover={{ color: custom_red }} />

                    <DrawerHeader className='select-none' height={100}>
                        <Box className='flex items-center gap-2'>
                            <img
                                src={logo}
                                className='size-16 p-3 rounded-2xl bg-no-repeat'
                                alt='Clover Flare'
                            />
                            <p>Menu</p>
                        </Box>
                    </DrawerHeader>

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
                                    rounded={round_default}
                                    _hover={{
                                        bg: primary_red,
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
