import { RowDetail } from '../../components/RowDetail';
import { CellDetail } from '../../components/CellDetail';
import { Box, useToast } from '@chakra-ui/react';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { ItemOrderCreate } from '../../types/order';
import { useOrder } from '../../hooks/useOrder';

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
    const toast = useToast();

    const currQuantity =
        selectedProducts?.find((p) => p.product_id === productId)?.quantity ||
        0;

    // function handlePlusQuantity() {
    //     setSelectedProducts((prevOrderData: OrderCreate | undefined) => {
    //         if (!prevOrderData) return prevOrderData;

    //         const newItems = prevOrderData.data_items.map((item) => {
    //             if (item.product_id === productId) {
    //                 return { ...item, quantity: item.quantity + 1 };
    //             }
    //             return item;
    //         });

    //         if (!newItems.find((item) => item.product_id === productId)) {
    //             newItems.push({
    //                 product_id: productId,
    //                 product_name: name,
    //                 quantity: 1,
    //                 value: value,
    //             });
    //         }

    //         return { ...prevOrderData, data_items: newItems };
    //     });
    // }

    return (
        <RowDetail>
            <CellDetail name='Código' content={code} />
            <CellDetail name='Produto' content={name} />
            <CellDetail
                name='Valor/unidade'
                content={Number(value).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })}
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
                                title: 'Alerta!',
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
