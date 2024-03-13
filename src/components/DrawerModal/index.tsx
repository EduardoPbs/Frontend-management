import { useRef } from 'react';
import { useNavigate } from 'react-router';
import {
    Button,
    Drawer,
    Divider,
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
    Inbox,
    Package,
    HomeIcon,
    Settings2,
    PercentCircle,
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
                            <Button
                                colorScheme='yellow'
                                className='w-full gap-3'
                                onClick={() => navigate('/')}
                            >
                                <HomeIcon />
                                <span>Início</span>
                            </Button>
                        </div>

                        <div className='flex flex-col justify-center gap-2'>
                            <span className='uppercase font-semibold text-lg'>
                                Sistema
                            </span>
                            <Divider />
                            <div className='flex flex-col justify-center gap-4'>
                                <Button
                                    colorScheme='yellow'
                                    className='w-full gap-3'
                                    onClick={() => navigate('/products')}
                                >
                                    <Package />
                                    <span>Produtos</span>
                                </Button>

                                <Button
                                    colorScheme='yellow'
                                    className='w-full gap-3'
                                    onClick={() => navigate('/orders')}
                                >
                                    <Inbox />
                                    <span>Pedidos</span>
                                </Button>

                                <Button
                                    colorScheme='yellow'
                                    className='w-full gap-3'
                                    onClick={() => navigate('/employees')}
                                >
                                    <Users />
                                    <span>Funcionários</span>
                                </Button>

                                <Button
                                    colorScheme='yellow'
                                    className='w-full gap-3'
                                >
                                    <PercentCircle />
                                    <span>Promo</span>
                                </Button>
                            </div>
                        </div>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button colorScheme='yellow' className='w-full gap-3'>
                            <Settings2 />
                            <span>Configurações</span>
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}
