import { Title } from '../../components/Title';
import { Content } from '../../components/Content';
import { LgSpinner } from '../../components/LgSpinner';
import { useProduct } from '../../hooks/useProduct';
import { OrderTable } from '../../components/TableOrder';
import { useNavigate } from 'react-router';
import { ProductEntity } from '@/types';
import { PageContainer } from '../../components/PageContainer';
import { useCashRegister } from '@/hooks/useCashRegister';
import { AlertCircle, ArrowRightCircle } from 'lucide-react';
import { usePromotion } from '@/hooks/usePromotion';
import { OrderChart } from '@/Pages/Home/chart';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Home() {
    const { loading, allProducts } = useProduct();
    const { } = useCashRegister();
    const { } = usePromotion();
    const navigate = useNavigate();

    if (loading) return <LgSpinner />;

    return (
        <PageContainer title='Home'>
            <Content className='w-full border-border-gray rounded-round-default bg-light-gray/30 shadow-sm'>
                <Title variant='h2'>
                    Estatísticas {''}
                    <span className='text-lg opacity-50 capitalize'>| Últimas vendas feitas / Estoque de produtos</span>
                </Title>
                <div className='grid grid-rows-2 grid-cols-2 grid-flow-col gap-4 min-h-[540px] h-[540px] font-semibold'>
                    <Content className='row-span-1 w-full h-full border-primary-black/20 rounded-round-default shadow-md'>
                        <OrderTable />
                    </Content>

                    <Content className={`${allProducts.products.length === 0 ? 'hidden' : ''} col-span-1 row-span-1 w-full border-primary-black/20 rounded-round-default shadow-md`}>
                        <div className='flex items-center gap-2 h-full bg-light-gray/30 shadow-sm'>
                            <Content className='w-full border-border-gray h-full'>
                                <Title variant='h3'>
                                    Notificações{' '}
                                    <span className='text-sm opacity-50 capitalize'>| Produtos com baixo estoque:{" "}
                                    </span>
                                    <span>{allProducts?.products
                                        .filter((p: ProductEntity) => p.estoque <= 10).length}</span>
                                </Title>

                                <ScrollArea className='max-h-[150px]'>
                                    <div className='flex flex-col gap-2 overflow-hidden rounded-round-default'>
                                        {allProducts.products && allProducts?.products
                                            .filter((p: ProductEntity) => p.estoque <= 10)
                                            .map((prod: ProductEntity, index: number) => (
                                                <p
                                                    key={index}
                                                    className='flex items-center justify-between gap-4 border-2 border-gray-400/60 rounded-round-default px-4 py-2 font-semibold hover:border-primary-hover-red hover:bg-primary-white/50 hover:cursor-default hover:shadow-md duration-150'
                                                >
                                                    <span className='flex items-center gap-2'>
                                                        <AlertCircle className='text-warning-red' />
                                                        <span className='w-[200px]'>{prod.nome}</span>
                                                    </span>
                                                    <span>
                                                        Estoque:{' '}
                                                        <span
                                                            className={
                                                                prod.estoque > 5
                                                                    ? 'text-custom-red'
                                                                    : 'text-primary-hover-red'
                                                            }
                                                        >
                                                            {prod.estoque}
                                                        </span>
                                                    </span>
                                                    <span>
                                                        Status:{' '}
                                                        <span
                                                            className={prod.ativo
                                                                ? 'text-agreed-green'
                                                                : 'text-primary-hover-red'
                                                            }
                                                        >
                                                            {prod.ativo ? 'Online' : 'Offline'}
                                                        </span>
                                                    </span>

                                                    <ArrowRightCircle
                                                        className='hover:cursor-pointer'
                                                        onClick={() => { navigate('/products'); }}
                                                    />
                                                </p>
                                            ))}
                                    </div>
                                </ScrollArea>
                            </Content>
                        </div>
                    </Content>
                    <Content className={`${allProducts.products.length === 0 ? 'row-span-3' : 'row-span-2'} col-span-1 row-span-2 w-full border-primary-black/20 rounded-round-default shadow-md`}>
                        <OrderChart />
                    </Content>
                </div>
            </Content >
        </PageContainer >
    );
}
