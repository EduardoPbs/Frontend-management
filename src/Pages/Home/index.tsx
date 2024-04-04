import { Title } from '../../components/Title';
import { Content } from '../../components/Content';
import { useOrder } from '../../hooks/useOrder';
import { useEffect } from 'react';
import { useProduct } from '../../hooks/useProduct';
import { useNavigate } from 'react-router';
import { OrderEntity } from '../../types/order';
import { PageContainer } from '../../components/PageContainer';
import { AlertCircle, ArrowRightCircle } from 'lucide-react';
import {
    Th,
    Tr,
    Td,
    Box,
    Tbody,
    Thead,
    Table,
    Tooltip,
    Spinner,
    TableContainer,
} from '@chakra-ui/react';

function OrderTable() {
    const { dataOrders, isLoading } = useOrder();

    useEffect(() => {
        document.title = 'Management | Home';
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

                    <Title variant='h3'>
                        Total:{' '}
                        <span className='text-3xl text-primary-hover-red'>
                            {dataOrders.total}
                        </span>
                    </Title>
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
                                          <Tr
                                              key={order.id}
                                              className='border-t-2 border-primary-black hover:bg-light-gray duration-150'
                                          >
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
    const { activeProducts, loadingActive, stockWarn } = useProduct();

    if (loadingActive)
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

                    <Title variant='h3'>
                        Total:{' '}
                        <span className='text-3xl text-primary-hover-red'>
                            {activeProducts.total}
                        </span>
                    </Title>
                </div>

                <Table size='sm' className=''>
                    <Thead>
                        <Tr>
                            <Th>Cód. Produto</Th>
                            <Th>Nome</Th>
                            <Th>Categoria</Th>
                            <Th>Estoque</Th>
                            <Th>Valor (R$)</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {activeProducts.products.length > 1
                            ? activeProducts.products
                                  .slice(0, 8)
                                  .map((product: any, index: number) => (
                                      <Tr
                                          key={index}
                                          className='border-t-2 border-primary-black hover:bg-light-gray duration-150'
                                      >
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
                                          <Td>
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
    const { loadingAll, allProducts } = useProduct();
    const navigate = useNavigate();

    if (loadingAll)
        return (
            <div className='flex justify-center'>
                <Spinner size='xl' color='yellow.500' />
            </div>
        );

    return (
        <PageContainer title='Home'>
            <div className='flex items-center gap-2 bg-light-gray/30 shadow-sm'>
                <Content className='w-full border-border-gray'>
                    <Title variant='h3'>
                        Notificações{' '}
                        <span className='text-sm opacity-50 capitalize'>
                            | Produtos com baixo estoque
                        </span>
                    </Title>

                    <div className='flex flex-col gap-2 max-h-[100px] overflow-hidden overflow-y-scroll rounded-round-default'>
                        {allProducts.products &&
                            allProducts?.products
                                .filter((p: any) => {
                                    return p.stock <= 10;
                                })
                                .map((prod: any, index: number) => {
                                    return (
                                        <p
                                            key={index}
                                            className='flex items-center justify-between gap-4 border-2 border-gray-400/60 rounded-round-default px-4 py-2 font-semibold hover:border-primary-hover-red hover:bg-primary-white/50 hover:cursor-default hover:shadow-md duration-150'
                                        >
                                            <span className='flex items-center gap-2'>
                                                <AlertCircle className='text-warning-red' />
                                                <span className='w-[200px]'>
                                                    {prod.name}
                                                </span>
                                            </span>
                                            <span>
                                                Estoque:{' '}
                                                <span
                                                    className={
                                                        prod.stock > 5
                                                            ? 'text-custom-red'
                                                            : 'text-primary-hover-red'
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
                                                            ? 'text-agreed-green'
                                                            : 'text-primary-hover-red'
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

            <Content className='w-full border-border-gray rounded-round-default bg-light-gray/30 shadow-sm'>
                <Title variant='h2'>
                    Estatísticas Recentes {''}
                    <span className='text-lg opacity-50 capitalize'>
                        | Últimos pedidos feitos / Estoque de produtos
                    </span>
                </Title>

                <div className='flex items-start justify-between gap-2 max-h-fit font-semibold'>
                    <Content className='w-1/2 border-primary-black/20 rounded-round-default shadow-md'>
                        <OrderTable />
                    </Content>

                    <Content className='w-1/2 border-primary-black/20 rounded-round-default shadow-md'>
                        <ProductTable />
                    </Content>
                </div>
            </Content>
        </PageContainer>
    );
}
