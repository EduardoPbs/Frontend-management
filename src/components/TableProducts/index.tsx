import { Spinner } from '@chakra-ui/react';
import { MenuIcon } from 'lucide-react';
import { useProduct } from '../../hooks/useProduct';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProductEntity } from '@/types/product';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function ProductTable() {
    const { allProducts, loading, stockWarn } = useProduct();

    if (loading)
        return (
            <div className='flex justify-center'>
                <Spinner size='xl' color='yellow.500' />
            </div>
        );

    return (
        <Table>
            <TableHeader>
                <TableRow className='bg-primary-black/15 hover:bg-primary-black/1'>
                    <TableHead className='text-primary-black uppercase'>Cód. Produto</TableHead>
                    <TableHead className='text-primary-black uppercase'>Nome</TableHead>
                    <TableHead className='text-primary-black uppercase'>Categoria</TableHead>
                    <TableHead className='text-primary-black uppercase'>Estoque</TableHead>
                    <TableHead className='text-primary-black uppercase'>Valor (R$)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {allProducts.products.map((product: ProductEntity) => (
                    <TableRow
                        key={product.id}
                        className='border-t-2 border-primary-black/15 hover:bg-light-gray/25 font-bold'
                    >
                        <TableCell>{product.codigo}</TableCell>
                        <TableCell>{product.nome}</TableCell>
                        <TableCell className='uppercase'>
                            <Popover>
                                <PopoverTrigger>
                                    <MenuIcon className='flex items-center gap-4 bg-primary-black/5 hover:bg-primary-black/10 text-black rounded-sm size-6' />
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
                            {Number(product.valorOriginal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
