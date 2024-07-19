import { Title } from '../../components/Title';
import { Content } from '@/components/Content';
import { Actions } from '@/Pages/Products/actions';
import { LgSpinner } from '../../components/LgSpinner';
import { useEffect, useState } from 'react';
import { useProduct } from '../../hooks/useProduct';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconButton } from '../../components/IconButton';
import { ProductEntity } from '../../types/product';
import { PageContainer } from '../../components/PageContainer';
import { MenuIcon, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PromotionEntity } from '@/types';

export function Products() {
    const [promotions, setPromotions] = useState<PromotionEntity[]>([]);
    const { stockWarn, getAllProducts, allProducts, loading, status, setStatus } = useProduct();

    const filteredProducts: ProductEntity[] = allProducts.products.filter((product: ProductEntity) => product);


    useEffect(() => {
        getAllProducts();
        document.title = 'Management | Produtos';

        setPromotions(JSON.parse(sessionStorage.getItem('promotions') || ''));
    }, [status]);

    if (loading)
        return (
            <LgSpinner />
        );

    return (
        <PageContainer title='Produtos'>
            <IconButton
                to='new'
                label='Novo produto'
                className='w-fit py-4'
                icon={PlusCircle}
            />

            <div className='flex items-center justify-between'>
                <Title variant='h3'>
                    Cadastrados:{' '}
                    <span className='text-4xl text-primary-red'>
                        {allProducts.total}
                    </span>
                </Title>
            </div>

            <Content className='w-full overflow-auto'>
                <Table>
                    <TableHeader>
                        <TableRow className='bg-primary-black/15 hover:bg-primary-black/15'>
                            <TableHead className='text-primary-black uppercase'>Cód. Produto</TableHead>
                            <TableHead className='text-primary-black uppercase'>Nome</TableHead>
                            <TableHead className='text-primary-black uppercase'>Categorias</TableHead>
                            <TableHead className='text-primary-black uppercase'>Estoque</TableHead>
                            <TableHead className='text-primary-black uppercase'>Valor (R$)</TableHead>
                            <TableHead className='text-primary-black uppercase'>Status</TableHead>
                            <TableHead className='text-primary-black uppercase'>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product: ProductEntity, index: number) => {
                            const hasActivePromotion: boolean = 
                                promotions.includes(promotions.filter((p: PromotionEntity) => p.produto.id === product.id)[0]) &&
                                promotions.includes(promotions.filter((p: PromotionEntity) => p.produto.id === product.id && p.ativo)[0]);
                            const productPromotion: PromotionEntity = promotions.filter((p: PromotionEntity) => p.produto.id === product.id)[0];

                            return (
                                <TableRow
                                    key={index}
                                    className='border-t-2 border-primary-black/15 hover:bg-light-gray/25 font-bold'
                                >
                                    <TableCell>{product.codigo}</TableCell>
                                    <TableCell className='flex flex-col justify-center'>
                                        {product.nome}
                                        <span
                                            className={`
                                                ${hasActivePromotion ? 'text-white bg-green-500 rounded px-3 py-0.5 w-fit' : 'hidden'}
                                            `}
                                        >
                                            Em Promoção - {Number(productPromotion?.desconto)}%
                                        </span>
                                    </TableCell>
                                    <TableCell className='uppercase'>
                                        <Popover>
                                            <PopoverTrigger>
                                                <div className='flex items-center gap-2 py-1 px-2 font-semibold bg-primary-black/5 hover:bg-primary-black/10 text-black rounded-sm duration-100'>
                                                    <MenuIcon /> Ver
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className='bg-primary-white font-semibold text-primary-black w-[200px]'>
                                                <p className='border-b-[1px] border-black text-center uppercase text-zinc-600 pb-3'>Categorias</p>
                                                <ScrollArea>
                                                    <div className='flex flex-col items-center max-h-[200px]'>
                                                        {product.categorias.map((c: string) => (
                                                            <p key={c} className='border-b-[1px] border-primary-black rounded-b-sm text-start w-full p-2 capitalize cursor-default hover:bg-primary-black/5 duration-100'>
                                                                {c.toLowerCase().replace('_', ' ')}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                    <TableCell className={`${stockWarn(product.estoque)} font-semibold`}>
                                        {product.estoque < 1 ? `${product.estoque}0` : product.estoque}
                                    </TableCell>
                                    <TableCell>
                                        {Number(product.valorOriginal).toLocaleString(
                                            'pt-BR', { style: 'currency', currency: 'BRL' }
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {product.ativo ? (
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
                                    </TableCell>
                                    <TableCell>
                                        <Actions id={product.id} status={product.ativo} handler={setStatus} />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Content>
        </PageContainer>
    );
}
