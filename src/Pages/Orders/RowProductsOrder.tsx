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
        code,
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
        <RowDetail>
            <CellDetail name='Código' content={code} />
            <CellDetail name='Produto' content={name} />
            <CellDetail
                name='Valor/unidade'
                content={Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            />
            <CellDetail name='Em estoque' content={quantity} />

            <Box className='flex items-center gap-2'>
                <MinusCircle
                    className='size-6 hover:cursor-pointer hover:text-custom-red duration-150'
                    onClick={() =>
                        handleMinusQuantity(setSelectedProducts, productId)
                    }
                />
                <span className='text-2xl text-primary-red font-bold text-center w-[42px]'>
                    {currQuantity}
                </span>
                <PlusCircle
                    className='size-6 hover:cursor-pointer hover:text-custom-red duration-150'
                    onClick={() => {
                        if (quantity === 0 || quantity <= currQuantity) {
                            toast({
                                title: 'Aviso!',
                                description: 'Produto sem estoque suficiente.',
                                status: 'info',
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
