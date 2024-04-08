import { http } from '../../service';
import { Title } from '../../components/Title';
import { CustomTh } from '../../components/CustomTh';
import { LgSpinner } from '../../components/LgSpinner';
import { IconButton } from '../../components/IconButton';
import { PackagePlus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { PageContainer } from '../../components/PageContainer';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import { useEffect, useState } from 'react';
import {
    primary_red,
    primary_white,
    round_default,
    table_row_hover,
    primary_hover_red,
} from '../../constants/styles';
import {
    Tr,
    Td,
    Box,
    Table,
    Thead,
    Tbody,
    Button,
    TableContainer,
} from '@chakra-ui/react';

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

    if (isLoading) return <LgSpinner />;

    return (
        <PageContainer title='Compras'>
            <IconButton
                onClick={createPurchase}
                label='Nova Compra'
                className='w-fit py-4'
                icon={PackagePlus}
                bgColor={primary_red}
                textColor={primary_white}
                bgHoverColor={primary_hover_red}
            />

            <div className='flex items-center justify-between'>
                <Title variant='h3'>Resumo - Pedidos</Title>

                <Title variant='h3'>
                    Pendentes:{' '}
                    <span className='text-4xl text-primary-red'>
                        {
                            purchaseData.purchases.filter((p: any) => {
                                return p.status === 'PENDENTE';
                            }).length
                        }
                    </span>
                </Title>

                <Title variant='h3'>
                    Finalizados:{' '}
                    <span className='text-4xl text-primary-red'>
                        {
                            purchaseData.purchases.filter((p: any) => {
                                return p.status === 'FINALIZADO';
                            }).length
                        }
                    </span>
                </Title>

                <Title variant='h3'>
                    Cadastrados:{' '}
                    <span className='text-4xl text-primary-red'>
                        {purchaseData.purchases.length}
                    </span>
                </Title>
            </div>

            <Box className='overflow-y-scroll scrollbar-hide border-2 border-border-gray rounded-round-default'>
                <TableContainer>
                    <Table size='sm'>
                        <Thead className='text-white text-xl select-none'>
                            <Tr>
                                <CustomTh>Cód. Compra</CustomTh>
                                <CustomTh>itens</CustomTh>
                                <CustomTh>Data</CustomTh>
                                <CustomTh>Total</CustomTh>
                                <CustomTh>Status</CustomTh>
                                <CustomTh outStyle='border-r-0'>Ações</CustomTh>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {purchaseData.purchases &&
                                purchaseData.purchases.map((purchase: any) => {
                                    return (
                                        <Tr
                                            key={purchase.id}
                                            className={table_row_hover}
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
                                            <Td
                                                className={`font-bold ${
                                                    purchase.status ===
                                                    'PENDENTE'
                                                        ? 'text-warning-red'
                                                        : 'text-agreed-green'
                                                }`}
                                            >
                                                {purchase.status}
                                            </Td>
                                            <Td>
                                                <Button
                                                    className='w-full'
                                                    height={8}
                                                    borderRadius={round_default}
                                                    backgroundColor={
                                                        primary_red
                                                    }
                                                    color={primary_white}
                                                    _hover={{
                                                        bg: primary_hover_red,
                                                    }}
                                                    onClick={() => {
                                                        navigate(
                                                            `${purchase.id}`
                                                        );
                                                    }}
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
