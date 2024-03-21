import { http } from '../../service';
import { Title } from '../../components/Title';
import { PackagePlus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { PageContainer } from '../../components/PageContainer';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import { useEffect, useState } from 'react';
import {
    Tr,
    Th,
    Td,
    Box,
    Table,
    Thead,
    Tbody,
    Button,
    Spinner,
    TableContainer,
} from '@chakra-ui/react';

function CustomTh({ children }: { children: React.ReactNode }) {
    return (
        <Th>
            <span className='text-white text-lg'>{children}</span>
        </Th>
    );
}

export function Purchases() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [purchaseData, setPurchaseData] = useState({
        purchases: [],
        total: 0,
    });

    const navigate = useNavigate();

    async function createPurchase() {
        await http
            .post('/purchase')
            .then((response: any) => {
                const purchaseId = response.data;
                navigate(`new/${purchaseId}`);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async function getPurchaseData() {
        try {
            const response = await http.get('/purchase');
            setPurchaseData({
                purchases: response.data,
                total: response.data.length,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        document.title = 'Management | Compras';
        getPurchaseData();
    }, []);

    if (isLoading)
        return (
            <PageContainer>
                <div className='flex justify-center'>
                    <Spinner size='xl' color='yellow.500' />
                </div>
            </PageContainer>
        );

    return (
        <PageContainer title='Compras'>
            <Box className='flex items-center'>
                <Button
                    className='flex items-center gap-2'
                    onClick={createPurchase}
                    colorScheme='yellow'
                >
                    <PackagePlus />
                    Nova Compra
                </Button>
            </Box>

            <div className='flex items-center justify-between'>
                <Title variant='h3'>Resumo - Pedidos</Title>

                <Title variant='h3'>
                    Cadastrados:{' '}
                    <span className='text-4xl text-amber-400'>
                        {purchaseData.purchases.length}
                    </span>
                </Title>
            </div>

            <Box className='overflow-y-scroll scrollbar-hide border-2 rounded-md'>
                <TableContainer>
                    <Table size='md'>
                        <Thead className='text-white text-xl select-none'>
                            <Tr>
                                <CustomTh>Cód. Compra</CustomTh>
                                <CustomTh>itens</CustomTh>
                                <CustomTh>Data</CustomTh>
                                <CustomTh>Total</CustomTh>
                                <CustomTh>Status</CustomTh>
                                <CustomTh>Ações</CustomTh>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {purchaseData.purchases &&
                                purchaseData.purchases.map((purchase: any) => {
                                    return (
                                        <Tr
                                            key={purchase.id}
                                            className='font-semibold hover:bg-zinc-100/30 duration-150'
                                        >
                                            <Td>{purchase.id.slice(0, 8)}</Td>
                                            <Td>{purchase.items.length}</Td>
                                            <Td>
                                                {toFullLocaleDate(
                                                    purchase.date
                                                )}
                                            </Td>
                                            <Td>
                                                {Number(
                                                    purchase.total
                                                ).toLocaleString('pt-br', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            </Td>
                                            <Td className='text-amber-400'>
                                                FINALIZADO
                                            </Td>
                                            <Td>
                                                <Button
                                                    className='w-full'
                                                    height={8}
                                                    colorScheme='yellow'
                                                    onClick={() =>
                                                        navigate(
                                                            `${purchase.id}`
                                                        )
                                                    }
                                                >
                                                    Ver detalhes
                                                </Button>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </PageContainer>
    );
}
