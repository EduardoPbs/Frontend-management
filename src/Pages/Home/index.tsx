import { http } from '../../service';
import { Title } from '../../components/Title';
import { Content } from '../../components/Content';
import { OrderEntity } from '../../constants/order';
import { PageContainer } from '../../components/PageContainer';
import { ProductEntity } from '../../constants/product';
import { useEffect, useState } from 'react';
import {
    Th,
    Tr,
    Td,
    Box,
    Tbody,
    Thead,
    Table,
    Spinner,
    TableContainer,
    Tooltip,
} from '@chakra-ui/react';
import { AlertCircle, ArrowRightCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

function OrderTable() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dataOrders, setDataOrders] = useState<{
        orders: OrderEntity[];
        total: number;
    }>({
        orders: [],
        total: 0,
    });

    async function getOrdersData() {
        setIsLoading(true);
        try {
            const response = await http.get('/orders');
            if (response.data) {
                setDataOrders({
                    orders: response.data,
                    total: response.data.length,
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        document.title = 'Management | Home';
        getOrdersData();
    }, []);

    if (isLoading)
        return (
            <div className='flex justify-center'>
                <Spinner size='xl' color='yellow.500' />
            </div>
        );

    return (
        <Box className='max-h-80 max-w-full overflow-y-scroll scrollbar-hide'>
            <TableContainer>
                <div className='flex items-center justify-between'>
                    <Title variant='h3'>Resumo - Pedidos</Title>

                    <Title variant='h3'>Total: {dataOrders.total}</Title>
                </div>
                <Table size='sm'>
                    <Thead>
                        <Tr>
                            <Th>Cód. Pedido</Th>
                            <Th>Qtde. itens</Th>
                            <Th>Total (R$)</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {dataOrders
                            ? /**@todo Remove slice() method and implement on Backend */
                              dataOrders.orders
                                  .slice(0, 8)
                                  .map((order: OrderEntity) => {
                                      return (
                                          <Tr key={order.id}>
                                              <Td>
                                                  {String(order.id).slice(0, 8)}
                                              </Td>
                                              <Td>{order.items.length}</Td>
                                              <Td>
                                                  {Number(
                                                      order.total
                                                  ).toLocaleString('pt-BR', {
                                                      style: 'currency',
                                                      currency: 'BRL',
                                                  })}
                                              </Td>
                                          </Tr>
                                      );
                                  })
                            : []}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
}

function ProductTable() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dataProducts, setDataProducts] = useState<{
        products: ProductEntity[];
        total: number;
    }>({
        products: [],
        total: 0,
    });

    async function getProductsData() {
        setIsLoading(true);
        try {
            const response = await http.get('/products');
            if (response.data) {
                setDataProducts({
                    products: response.data,
                    total: response.data.length,
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
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
        getProductsData();
    }, []);

    if (isLoading)
        return (
            <div className='flex justify-center'>
                <Spinner size='xl' color='yellow.500' />
            </div>
        );

    return (
        <Box className='max-h-80 max-w-full overflow-y-scroll scrollbar-hide'>
            <TableContainer>
                <div className='flex items-center justify-between'>
                    <Title variant='h3'>Resumo - Produtos</Title>

                    <Title variant='h3'>Total: {dataProducts.total}</Title>
                </div>

                <Table size='sm' className=''>
                    <Thead>
                        <Tr>
                            <Th>Cód. Produto</Th>
                            <Th>Nome</Th>
                            <Th>Categoria</Th>
                            <Th>Estoque</Th>
                            <Th isNumeric>Valor (R$)</Th>
                        </Tr>
                    </Thead>

                    <Tbody className=''>
                        {dataProducts.products.length > 1
                            ? dataProducts.products
                                  .slice(0, 8)
                                  .map((product: any) => (
                                      <Tr key={product.id}>
                                          <Td>{product.code}</Td>
                                          <Td>{product.name}</Td>
                                          <Td>{product.category}</Td>
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
                                      </Tr>
                                  ))
                            : []}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export function Home() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [dataProducts, setDataProducts] = useState([]);
    const navigate = useNavigate();

    async function getProductsData() {
        try {
            const response = await http.get('/products');
            if (response.data) {
                setDataProducts(response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getProductsData();
    }, []);

    if (isLoading)
        return (
            <div className='flex justify-center'>
                <Spinner size='xl' color='yellow.500' />
            </div>
        );

    return (
        <PageContainer title='Home'>
            <div className='flex items-center gap-2'>
                <Content className='w-full'>
                    <Title variant='h3'>
                        Notificações{' '}
                        <span className='text-sm opacity-50 capitalize'>
                            | Produtos com baixo estoque
                        </span>
                    </Title>

                    <div className='flex flex-col gap-2 max-h-[110px] overflow-hidden overflow-y-scroll rounded-sm'>
                        {dataProducts &&
                            dataProducts
                                ?.filter((p: any) => {
                                    return p.stock <= 10;
                                })
                                .map((prod: any, index: number) => {
                                    return (
                                        <p
                                            key={index}
                                            className='flex items-center justify-between gap-4 border-2 px-4 py-2 hover:border-amber-400 hover:bg-white/30 hover:cursor-default duration-100'
                                        >
                                            <span className='flex items-center gap-2'>
                                                <AlertCircle className='text-orange-300' />
                                                <span className='w-[200px]'>
                                                    {prod.name}
                                                </span>
                                            </span>
                                            <span>
                                                Estoque:{' '}
                                                <span
                                                    className={
                                                        prod.stock > 5
                                                            ? 'text-orange-300'
                                                            : 'text-red-500'
                                                    }
                                                >
                                                    {prod.stock}
                                                </span>
                                            </span>
                                            <span>
                                                Status:{' '}
                                                <span
                                                    className={
                                                        prod.active
                                                            ? 'text-green-300'
                                                            : 'text-yellow-500'
                                                    }
                                                >
                                                    {prod.active
                                                        ? 'Online'
                                                        : 'Offline'}
                                                </span>
                                            </span>

                                            <Tooltip label='Ir para produtos'>
                                                <ArrowRightCircle 
                                                    className='hover:cursor-pointer' 
                                                    onClick={() => {
                                                        navigate('/products');
                                                    }}
                                                />
                                            </Tooltip>
                                        </p>
                                    );
                                })}
                    </div>
                </Content>
            </div>

            <Content className='w-full'>
                <Title variant='h2'>
                    Estatísticas Recentes {''}
                    <span className='text-lg opacity-50 capitalize'>
                        | Últimos pedidos feitos / Estoque de produtos
                    </span>
                </Title>

                <div className='flex items-start justify-between gap-2 max-h-fit'>
                    <Content className='w-1/2'>
                        <OrderTable />
                    </Content>

                    <Content className='w-1/2'>
                        <ProductTable />
                    </Content>
                </div>
            </Content>
        </PageContainer>
    );
}
