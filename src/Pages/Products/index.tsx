import { http } from '../../service';
import { Title } from '../../components/Title';
import { DrawerModal } from '../../components/DrawerModal';
import { useNavigate } from 'react-router';
import { PageContainer } from '../../components/PageContainer';
import { ProductEntity } from '../../constants/product';
import { useState, useEffect } from 'react';
import { PlusCircle, Settings } from 'lucide-react';
import {
    Tr,
    Th,
    Td,
    Box,
    Table,
    Tbody,
    Thead,
    Portal,
    Button,
    Popover,
    Spinner,
    PopoverBody,
    PopoverArrow,
    PopoverContent,
    TableContainer,
    PopoverTrigger,
} from '@chakra-ui/react';

export function Products() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [dataProducts, setDataProducts] = useState<{
        products: ProductEntity[];
        total: number;
    }>({
        products: [],
        total: 0,
    });

    async function getDataProducts() {
        try {
            const response = await http.get('/products/all');
            if (!response.data) {
                return;
            }
            setDataProducts({
                products: response.data,
                total: response.data.length,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function disableProduct(id: string) {
        try {
            await http.put(`/products/${id}`, {
                active: false,
            });
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }

    async function enableProduct(id: string) {
        try {
            await http.put(`/products/${id}`, {
                active: true,
            });
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }

    function stockWarn(quantity: number): string {
        if (quantity < 6) {
            return 'text-red-500';
        } else if (quantity < 11) {
            return 'text-amber-400';
        }
        return '';
    }

    useEffect(() => {
        getDataProducts();
    }, []);

    if (isLoading)
        return (
            <div className='flex justify-center'>
                <Spinner size='xl' color='yellow.500' />
            </div>
        );

    return (
        <PageContainer>
            <div className='flex items-center justify-start gap-4'>
                <DrawerModal />

                <Title>Produtos</Title>
            </div>

            <div className='flex flex-col gap-4 w-full h-fit overflow-hidden'>
                <Box className='flex items-center'>
                    <Button
                        colorScheme='yellow'
                        className='flex items-center gap-2 capitalize select-none'
                        onClick={() => navigate('new')}
                    >
                        <PlusCircle />
                        Novo produto
                    </Button>
                </Box>

                <div className='flex items-center justify-between'>
                    <Title variant='h3'>Resumo - Produtos</Title>

                    <Title variant='h3'>
                        Cadastrados:{' '}
                        <span className='text-4xl text-amber-400'>
                            {dataProducts.total}
                        </span>
                    </Title>
                </div>

                <Box className='overflow-y-scroll scrollbar-hide border-2 rounded-md'>
                    <TableContainer>
                        <Table size='lg'>
                            <Thead className='text-white text-xl select-none'>
                                <Tr>
                                    <Th>Cód. Produto</Th>
                                    <Th>Nome</Th>
                                    <Th>Categoria</Th>
                                    <Th>Estoque</Th>
                                    <Th isNumeric>Valor (R$)</Th>
                                    <Th>Status</Th>
                                    <Th>Ações</Th>
                                </Tr>
                            </Thead>

                            <Tbody>
                                {dataProducts.products &&
                                    dataProducts?.products.map(
                                        (product: any) => (
                                            <Tr
                                                key={product.id}
                                                className='font-semibold'
                                            >
                                                <Td>{product.code}</Td>
                                                <Td>{product.name}</Td>
                                                <Td className='uppercase'>
                                                    {product.category}
                                                </Td>
                                                <Td
                                                    className={`${stockWarn(
                                                        product.stock
                                                    )} font-semibold`}
                                                >
                                                    {product.stock}
                                                </Td>
                                                <Td isNumeric>
                                                    {Number(
                                                        product.value
                                                    ).toLocaleString('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    })}
                                                </Td>
                                                <Td>
                                                    {product.active ? (
                                                        <span className='flex items-center gap-1 text-green-300'>
                                                            <div className='size-2 bg-green-300 rounded-full' />
                                                            Online
                                                        </span>
                                                    ) : (
                                                        <span className='flex items-center gap-1 text-red-400'>
                                                            <div className='size-2 bg-red-400 rounded-full' />
                                                            Offline
                                                        </span>
                                                    )}
                                                </Td>
                                                <Td>
                                                    <Popover
                                                        closeOnBlur={false}
                                                    >
                                                        <PopoverTrigger>
                                                            <Button colorScheme='amber'>
                                                                <Settings className='text-amber-400 hover:text-amber-600 hover:cursor-pointer duration-150' />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <Portal>
                                                            <PopoverContent width='fit-content'>
                                                            <PopoverArrow />
                                                                <PopoverBody>
                                                                    <Box className='flex gap-2'>
                                                                        <Button
                                                                            colorScheme='yellow'
                                                                            onClick={() =>
                                                                                navigate(
                                                                                    `edit/${product.id}`
                                                                                )
                                                                            }
                                                                        >
                                                                            Editar
                                                                        </Button>
                                                                        <Popover>
                                                                            <PopoverTrigger>
                                                                                {product.active ? (
                                                                                    <Button
                                                                                        type='button'
                                                                                        background='red.400'
                                                                                        onClick={() =>
                                                                                            disableProduct(
                                                                                                product.id
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Desativar
                                                                                    </Button>
                                                                                ) : (
                                                                                    <Button
                                                                                        type='button'
                                                                                        background='green.200'
                                                                                        onClick={() =>
                                                                                            enableProduct(
                                                                                                product.id
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Ativar
                                                                                    </Button>
                                                                                )}
                                                                            </PopoverTrigger>
                                                                        </Popover>
                                                                    </Box>
                                                                </PopoverBody>
                                                            </PopoverContent>
                                                        </Portal>
                                                    </Popover>
                                                </Td>
                                            </Tr>
                                        )
                                    )}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </div>
        </PageContainer>
    );
}
