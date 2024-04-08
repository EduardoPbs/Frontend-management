import { Title } from '../../components/Title';
import { CustomTh } from '../../components/CustomTh';
import { useEffect } from 'react';
import { LgSpinner } from '../../components/LgSpinner';
import { useProduct } from '../../hooks/useProduct';
import { IconButton } from '../../components/IconButton';
import { useNavigate } from 'react-router';
import { PageContainer } from '../../components/PageContainer';
import { PlusCircle, Settings } from 'lucide-react';
import {
    custom_red,
    primary_red,
    agreed_green,
    round_default,
    primary_white,
    table_row_hover,
    primary_hover_red,
    agreed_hover_green,
} from '../../constants/styles';
import {
    Tr,
    Td,
    Box,
    Table,
    Tbody,
    Thead,
    Portal,
    Button,
    Popover,
    PopoverBody,
    PopoverArrow,
    PopoverContent,
    TableContainer,
    PopoverTrigger,
} from '@chakra-ui/react';

export function Products() {
    const {
        allProducts,
        loadingAll,
        stockWarn,
        enableProduct,
        disableProduct,
    } = useProduct();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Management | Produtos';
    }, []);

    if (loadingAll) return <LgSpinner />;

    return (
        <PageContainer title='Produtos'>
            <IconButton
                to='new'
                label='Novo produto'
                className='w-fit py-4'
                icon={PlusCircle}
                bgColor={primary_red}
                textColor={primary_white}
                bgHoverColor={primary_hover_red}
            />

            <div className='flex items-center justify-between'>
                <Title variant='h3'>Resumo - Produtos</Title>

                <Title variant='h3'>
                    Cadastrados:{' '}
                    <span className='text-4xl text-primary-red'>
                        {allProducts.total}
                    </span>
                </Title>
            </div>

            <Box className='overflow-y-scroll scrollbar-hide border-2 border-border-gray rounded-md'>
                <TableContainer>
                    <Table size='sm'>
                        <Thead className='text-white text-xl select-none'>
                            <Tr>
                                <CustomTh>Cód. Produto</CustomTh>
                                <CustomTh>Nome</CustomTh>
                                <CustomTh>Categoria</CustomTh>
                                <CustomTh>Estoque</CustomTh>
                                <CustomTh>Valor (R$)</CustomTh>
                                <CustomTh>Status</CustomTh>
                                <CustomTh outStyle='border-r-0'>Ações</CustomTh>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {allProducts.products.map((product: any) => (
                                <Tr
                                    key={product.id}
                                    className={table_row_hover}
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
                                    <Td>
                                        {Number(product.value).toLocaleString(
                                            'pt-BR',
                                            {
                                                style: 'currency',
                                                currency: 'BRL',
                                            }
                                        )}
                                    </Td>
                                    <Td>
                                        {product.active ? (
                                            <span className='flex items-center gap-1 text-agreed-green'>
                                                <div className='size-2 bg-agreed-green rounded-full' />
                                                Online
                                            </span>
                                        ) : (
                                            <span className='flex items-center gap-1 text-primary-hover-red'>
                                                <div className='size-2 bg-primary-hover-red rounded-full' />
                                                Offline
                                            </span>
                                        )}
                                    </Td>
                                    <Td>
                                        <Popover closeOnBlur={false}>
                                            <PopoverTrigger>
                                                <Button colorScheme='amber'>
                                                    <Settings className='text-primary-black hover:text-primary-red hover:cursor-pointer duration-150' />
                                                </Button>
                                            </PopoverTrigger>
                                            <Portal>
                                                <PopoverContent width='fit-content'>
                                                    <PopoverArrow />
                                                    <PopoverBody>
                                                        <Box className='flex gap-2'>
                                                            <Button
                                                                borderRadius={
                                                                    round_default
                                                                }
                                                                _hover={{
                                                                    bg: primary_red,
                                                                    color: primary_white,
                                                                }}
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
                                                                            borderRadius={
                                                                                round_default
                                                                            }
                                                                            backgroundColor={
                                                                                custom_red
                                                                            }
                                                                            color={
                                                                                primary_white
                                                                            }
                                                                            _hover={{
                                                                                bg: primary_hover_red,
                                                                            }}
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
                                                                            borderRadius={
                                                                                round_default
                                                                            }
                                                                            backgroundColor={
                                                                                agreed_green
                                                                            }
                                                                            color={
                                                                                primary_white
                                                                            }
                                                                            _hover={{
                                                                                bg: agreed_hover_green,
                                                                            }}
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
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </PageContainer>
    );
}
