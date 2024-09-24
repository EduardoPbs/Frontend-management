import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Content } from "@/components/Content";
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { IconButton } from "@/components/IconButton";
import { useProduct } from "@/hooks/useProduct";
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProductEntity } from "@/types";
import { PageContainer } from "@/components/PageContainer";
import { ArrowLeftCircle, Trash2, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useLocation } from 'react-router';

type ProductStockType = {
    id: string;
    name: string;
    quantity: number;
    value: number;
    total: number;
};

export function StockForm() {
    const [productSelected, setProductSelected] = useState<ProductEntity>();
    const [value, setValue] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [products, setProducts] = useState<ProductStockType[]>([]);

    const { allProducts } = useProduct();
    const toast = useToast();
    const location = useLocation();

    const productsFiltered: ProductStockType[] = products.filter((p: ProductStockType) => p);

    const isOutput: boolean = location.pathname.includes('output');

    return (
        <PageContainer title='Registro'>
            <IconButton
                to={-1}
                label='Voltar'
                className='w-fit'
                icon={ArrowLeftCircle}
            />
            <Content className='w-full flex items-center overflow-auto'>
                <Card className="bg-white dark:bg-gray-900 w-[600px]">
                    <div className="max-w-2xl p-4 py-1 mx-auto">
                        <CardHeader className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                            <CardTitle>
                                {!isOutput ? 'Entrada de Estoque' : 'Saída de Estoque'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                className='flex flex-col gap-4 w-full'
                            >
                                <div className='flex items-end justify-between w-full gap-4'>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                type='button'
                                                className='mt-6 hover:bg-primary-hover-red'
                                            >
                                                Escolher produtos
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                Dados de Registro
                                            </AlertDialogHeader>
                                            <AlertDialogDescription asChild>
                                                <>
                                                    <div className='flex flex-col justify-center'>
                                                        <div className='flex flex-col justify-center -gap-1 mb-2'>
                                                            <label htmlFor='value' className='font-black'>
                                                                Produto:
                                                            </label>
                                                            <Select
                                                                onValueChange={(e: string) => {
                                                                    setProductSelected(JSON.parse(e));
                                                                }}
                                                            >
                                                                <SelectTrigger className='w-[180px] font-semibold'>
                                                                    <SelectValue placeholder="Produtos" />
                                                                </SelectTrigger>
                                                                <SelectContent className='max-h-[300px] font-semibold'>
                                                                    {allProducts.products.map((product: ProductEntity, index: number) => {
                                                                        const foundProd: ProductStockType = products.filter((p: ProductStockType) => p.id === product.id)[0];
                                                                        if (products.includes(foundProd)) return;

                                                                        return (
                                                                            <SelectItem
                                                                                key={index}
                                                                                value={JSON.stringify(product)}
                                                                                className='capitalize'
                                                                            >
                                                                                {product.nome}
                                                                            </SelectItem>
                                                                        );
                                                                    })}
                                                                </SelectContent>
                                                            </Select>

                                                            {productSelected && <div className='flex items-center justify-between'>
                                                                <p className='flex items-center gap-1'>
                                                                    Em estoque:
                                                                    <span className='font-semibold text-lg'>
                                                                        {allProducts.products.filter((product: ProductEntity) => product.id === productSelected?.id)[0] ?
                                                                            allProducts.products.filter((product: ProductEntity) => product.id === productSelected?.id)[0].estoque :
                                                                            0}
                                                                    </span>
                                                                </p>
                                                                <p className='flex items-center gap-1'>
                                                                    Valor de Venda:
                                                                    <span className='font-semibold text-lg'>
                                                                        {allProducts.products.filter((product: ProductEntity) => product.id === productSelected?.id)[0] ?
                                                                            allProducts.products.filter((product: ProductEntity) => product.id === productSelected?.id)[0].valorOriginal
                                                                                .toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' }) :
                                                                            0}
                                                                    </span>
                                                                </p>
                                                            </div>}
                                                        </div>
                                                        <div className='flex flex-col justify-center -gap-1 my-1'>
                                                            <label htmlFor='value' className='font-black'>
                                                                Valor de Compra:
                                                            </label>
                                                            <Input
                                                                name='value'
                                                                width={250}
                                                                type='number'
                                                                min={1}
                                                                placeholder='9.99'
                                                                className='my-2'
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    setValue(Number(e.target.value));
                                                                }}
                                                            />
                                                        </div>
                                                        <div className='flex flex-col justify-center -gap-1 my-1'>
                                                            <label htmlFor='quantity' className='font-black'>
                                                                Quantidade:
                                                            </label>
                                                            <Input
                                                                name='quantity'
                                                                width={250}
                                                                type='number'
                                                                min={1}
                                                                placeholder='16'
                                                                className='my-2'
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    setQuantity(Number(e.target.value));
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className='text-xl'>
                                                        Total:{' '}
                                                        <span className='font-black'>
                                                            {(value * quantity).toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })}
                                                        </span>
                                                    </p>
                                                </>
                                            </AlertDialogDescription>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancelar
                                                </AlertDialogCancel>
                                                <AlertDialogAction asChild>
                                                    <Button
                                                        disabled={!productSelected}
                                                        onClick={() => {
                                                            if (!productSelected || quantity <= 0 || value <= 0) {
                                                                toast({
                                                                    title: 'Erro!',
                                                                    colorScheme: 'red',
                                                                    description: 'Preencha os dados corretamente.',
                                                                    status: 'warning',
                                                                    position: 'top-right',
                                                                    isClosable: true,
                                                                    duration: 2000,
                                                                });
                                                                return;
                                                            }

                                                            const productStock: ProductStockType = {
                                                                id: productSelected?.id || '',
                                                                name: productSelected?.nome || '',
                                                                value: value,
                                                                quantity: quantity,
                                                                total: quantity * value
                                                            };

                                                            setProductSelected(undefined);
                                                            setQuantity(0);
                                                            setValue(0);

                                                            setProducts((prev: ProductStockType[]) => {
                                                                return [...prev, productStock];
                                                            });
                                                        }}
                                                    >
                                                        Confirmar
                                                    </Button>
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <p>
                                        Selecionados: {' '}
                                        <span className='font-semibold text-lg'>
                                            {products.length}
                                        </span></p>
                                </div>

                                <ScrollArea className='h-56'>
                                    <div className='flex flex-col items-center justify-between w-full gap-4 px-3'>
                                        {productsFiltered.map((product: ProductStockType) => {
                                            return (
                                                <div key={product.id} className='flex justify-between px-4 py-2 items-center bg-slate-100 w-full hover:scale-[101%] cursor-default hover:shadow-md shadow-inner transition-all duration-150'>
                                                    <Trash2
                                                        className='hover:text-primary-red hover:scale-110 self-start mt-4 cursor-pointer duration-150 max-w-[100px] w-1/'
                                                        onClick={() => {
                                                            setProducts((prev: ProductStockType[]) => {
                                                                return prev.filter((p: ProductStockType) => p.id !== product.id);
                                                            });
                                                        }}
                                                    />
                                                    <p className='flex flex-col justify-center max-w-[100px] w-1/5 text-wrap break-all'>
                                                        <span className='font-semibold text-lg'>
                                                            {product.name}
                                                        </span>
                                                    </p>
                                                    <p className='flex flex-col justify-center max-w-[100px] w-1/5'>
                                                        Qtde.:
                                                        <span className='font-semibold text-lg'>
                                                            {product.quantity}
                                                        </span>
                                                    </p>
                                                    <p className='flex flex-col justify-center max-w-[100px] w-1/5'>
                                                        Valor:
                                                        <span className='font-semibold text-lg'>
                                                            {product.value.toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })}
                                                        </span>
                                                    </p>
                                                    <p className='flex flex-col justify-center max-w-[100px] w-1/5'>
                                                        Subtotal:
                                                        <span className='font-semibold text-lg'>
                                                            {product.total.toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })}
                                                        </span>
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                                <p className='flex flex-col justify-center'>
                                    Total:
                                    <span className='font-semibold text-lg'>
                                        {productsFiltered.reduce((acc: number, currVal: ProductStockType) => {
                                            return acc += currVal.value * currVal.quantity;
                                        }, 0).toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })}
                                    </span>
                                </p>
                                <Button
                                    disabled={productsFiltered.length < 1}
                                    className='hover:bg-primary-hover-red'
                                    type='submit'
                                >
                                    Registrar
                                </Button>
                            </form>
                        </CardContent>
                    </div>
                </Card >
            </Content >
        </PageContainer >
    );
}
