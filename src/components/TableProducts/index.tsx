import { Title } from '../Title';
import { useProduct } from '../../hooks/useProduct';
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
} from '@chakra-ui/react';

export function ProductTable() {
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
