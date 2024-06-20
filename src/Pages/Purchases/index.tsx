import { http } from '../../service';
import { Title } from '../../components/Title';
import { Button } from '@/components/ui/button';
import { Content } from '@/components/Content';
import { LgSpinner } from '../../components/LgSpinner';
import { IconButton } from '../../components/IconButton';
import { OrderEntity } from '@/types/order';
import { PackagePlus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { PageContainer } from '../../components/PageContainer';
import { table_row_hover } from '@/constants/styles';
import { toFullLocaleDate } from '@/utils/toFullLocaleDate';
import { useEffect, useState } from 'react';
import { Table, TableRow, TableBody, TableHead, TableHeader, TableCell } from '@/components/ui/table';

export function Purchases() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [purchaseData, setPurchaseData] = useState<{ purchases: OrderEntity[]; total: number; }>({
        purchases: [],
        total: 0
    });

    const navigate = useNavigate();

    async function getPurchaseData() {
        try {
            const response = await http.get<OrderEntity[]>('/transactions/type/COMPRA');
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
                to={'new'}
                label='Nova Compra'
                className='w-fit py-4'
                icon={PackagePlus}
            />

            <div className='flex items-center justify-between'>
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

            <Content className='w-full overflow-auto'>
                <Table>
                    <TableHeader className='bg-primary-black/15 hover:bg-primary-black/15'>
                        <TableRow>
                            <TableHead className='text-primary-black uppercase'>Cód. Compra</TableHead>
                            <TableHead className='text-primary-black uppercase'>itens</TableHead>
                            <TableHead className='text-primary-black uppercase'>Data</TableHead>
                            <TableHead className='text-primary-black uppercase'>Total</TableHead>
                            <TableHead className='text-primary-black uppercase'>Status</TableHead>
                            <TableHead className='text-primary-black uppercase'>Ações</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {purchaseData.purchases.map((purchase: OrderEntity) => {
                            return (
                                <TableRow
                                    key={purchase.id}
                                    className={table_row_hover}
                                >
                                    <TableCell>{purchase.id.slice(0, 8)}</TableCell>
                                    <TableCell>{purchase.quantidade_itens}</TableCell>
                                    <TableCell>{toFullLocaleDate(purchase.criado_em)}</TableCell>
                                    <TableCell>
                                        {Number(
                                            purchase.total
                                        ).toLocaleString('pt-br', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        })}
                                    </TableCell>
                                    <TableCell
                                        className={`font-bold ${purchase.status === 'PENDENTE' ? 'text-warning-red' : 'text-agreed-green'}`}
                                    >
                                        {purchase.status}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            className='w-full hover:bg-primary-hover-red'
                                            onClick={() => { navigate(`${purchase.id}`); }}
                                        >
                                            Ver detalhes
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        }).reverse()}
                    </TableBody>
                </Table>
            </Content>
        </PageContainer >
    );
}
