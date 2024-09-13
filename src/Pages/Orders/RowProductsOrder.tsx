import { Box, useToast } from '@chakra-ui/react';
import { useOrder } from '../../hooks/useOrder';
import { RowDetail } from '../../components/RowDetail';
import { CellDetail } from '../../components/CellDetail';
import { ItemOrderCreate } from '../../types/order';
import { MinusCircle, PlusCircle } from 'lucide-react';

interface IRowProductsOrder {
    name: string;
    code: number;
    value: number;
    quantity: number;
    productId: string;
    selectedProducts: ItemOrderCreate[] | undefined;
    setSelectedProducts: any;
}

export function RowProductsOrder(props: IRowProductsOrder) {
    const {
        name,
        value,
        quantity,
        productId,
        selectedProducts,
        setSelectedProducts,
    } = props;
    const { handleMinusQuantity, handlePlusQuantity } = useOrder();

    const currQuantity =
        selectedProducts?.find((p) => p.produto_id === productId)?.quantidade ||
        0;

    const toast = useToast();

    return (
            <RowDetail quantity={quantity}>
                <CellDetail className='w-fit' name='Produto' content={name} />
                <CellDetail className='w-fit'
                    name='Valor/unidade'
                    content={Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                />
                <CellDetail className='w-fit' name='Em estoque' content={quantity} />

                <Box className='flex items-center gap-2'>
                    <MinusCircle
                        className={`${quantity < 1 && 'hover:cursor-default hover:text-black'} size-6 cursor-pointer hover:text-custom-red duration-150`}
                        onClick={() =>
                            handleMinusQuantity(setSelectedProducts, productId)
                        }
                    />
                    <span className='text-2xl text-primary-red font-bold text-center w-[42px]'>
                        {currQuantity}
                    </span>
                    <PlusCircle
                        className={`${quantity < 1 && 'hover:cursor-default hover:text-black'} size-6 cursor-pointer hover:text-custom-red duration-150`}
                        onClick={() => {
                            if (quantity === 0 || quantity <= currQuantity) {
                                toast({
                                    title: 'Aviso!',
                                    colorScheme: 'red',
                                    description: 'Produto sem estoque suficiente.',
                                    status: 'warning',
                                    position: 'top-right',
                                    duration: 1500,
                                    isClosable: true,
                                });
                            } else {
                                handlePlusQuantity(
                                    setSelectedProducts,
                                    productId,
                                    name,
                                    value
                                );
                            }
                        }}
                    />
                </Box>
            </RowDetail>
    );
}
