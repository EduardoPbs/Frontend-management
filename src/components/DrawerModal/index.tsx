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
    LogOut,
    Package,
    Settings,
    HomeIcon,
    ShoppingBag,
    PercentCircle,
    Package2,
    Store,
} from 'lucide-react';

export function DrawerModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const btnRef = useRef();

    return (
        <>
            <Button ref={btnRef} colorScheme='orange' onClick={onOpen}>
                <Menu />
            </Button>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />

                <DrawerContent color='white' bg='gray.900'>
                    <DrawerCloseButton />

                    <DrawerHeader>Painel</DrawerHeader>

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
                                    to='#'
                                />
                                <IconButton
                                    icon={PercentCircle}
                                    label='Promoções'
                                    to='#'
                                />
                                <IconButton icon={Store} label='Caixa' to='#' />
                            </div>
                        </div>
                    </DrawerBody>

                    <DrawerFooter>
                        <Box className='flex items-center gap-2 w-full'>
                            <Tooltip label='Ir para configurações'>
                                <Button
                                    colorScheme='yellow'
                                    className='w-full gap-3'
                                    onClick={() => {
                                        navigate('#');
                                    }}
                                >
                                    <Settings />
                                </Button>
                            </Tooltip>
                            <IconButton
                                icon={LogOut}
                                label='Sair'
                                to='/login'
                                iconStyle='size-10'
                                colorScheme='red'
                                onClick={() => {
                                    sessionStorage.removeItem('token');
                                }}
                            />
                        </Box>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}
