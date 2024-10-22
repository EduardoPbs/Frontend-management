import { Button } from '@/components/ui/button';
import { Box } from '@chakra-ui/react';
import { RowDetail } from '../../components/RowDetail';
import { CellDetail } from '../../components/CellDetail';
import { ItemOrderCreate, OrderCreate } from '@/types';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { useOrder } from '@/hooks/useOrder';

export function RowProductsPurchase({
    name,
    code,
    value,
    quantity,
    productId,
    selectedProducts,
    setSelectedProducts,
}: {
    name: string;
    code: number;
    value: number;
    quantity: number;
    productId: string;
    selectedProducts: ItemOrderCreate[] | undefined;
    setSelectedProducts: any;
}) {
    const { handlePlusQuantity, handleMinusQuantity } = useOrder();

    const currQuantity =
        selectedProducts?.find((p) => p.produto_id === productId)?.quantidade ||
        0;

    function handleMinus10() {
        setSelectedProducts(
            (prevPurchaseData: OrderCreate) =>
                prevPurchaseData && {
                    ...prevPurchaseData,
                    data_items: prevPurchaseData.data_items
                        .map((item: ItemOrderCreate) =>
                            item.produto_id === productId && item.quantidade > 0
                                ? { ...item, quantidade: item.quantidade - 10 }
                                : item
                        )
                        .filter((item: ItemOrderCreate) => item.quantidade > 0),
                }
        );
    }

    function handlePlus10() {
        setSelectedProducts((prevPurchaseData: OrderCreate | undefined) => {
            if (!prevPurchaseData) return prevPurchaseData;
            const newItems = prevPurchaseData?.data_items.map((item: ItemOrderCreate) => {
                if (item.produto_id === productId) {
                    return { ...item, quantidade: item.quantidade + 10 };
                }
                return item;
            });

            if (!newItems.find((item: ItemOrderCreate) => item.produto_id === productId)) {
                newItems.push({
                    produto_id: productId,
                    produto_nome: name,
                    quantidade: 10,
                    valor_unitario: value,
                });
            }

            return { ...prevPurchaseData, data_items: newItems };
        });
    }

    return (
        <RowDetail quantity={100}>
            <CellDetail name='Código' content={code} />
            <CellDetail name='Produto' content={name} />
            <CellDetail name='No estoque' content={quantity} />
            <Box className='flex items-center gap-2'>
                <Button
                    className='hover:bg-primary-hover-red'
                    onClick={handleMinus10}
                >
                    -10
                </Button>
                <MinusCircle
                    className={`size-6 ${currQuantity <= 0
                        ? 'text-zinc-400 hover:cursor-default'
                        : 'hover:text-primary-red hover:cursor-pointer'
                        } duration-150`}
                    onClick={() => handleMinusQuantity(setSelectedProducts, productId)}
                />
                <span className='text-2xl text-primary-red font-bold text-center w-[42px]'>
                    {currQuantity}
                </span>
                <PlusCircle
                    className='size-6 hover:cursor-pointer hover:text-primary-red duration-150'
                    onClick={() => {
                        handlePlusQuantity(setSelectedProducts, productId, name, value);
                    }}
                />
                <Button
                    className='hover:bg-primary-hover-red'
                    onClick={() => {
                        handlePlus10();
                    }}
                >
                    +10
                </Button>
            </Box>
        </RowDetail>
    );
}