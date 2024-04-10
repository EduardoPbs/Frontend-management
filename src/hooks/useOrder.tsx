import { useEffect, useState } from 'react';
import { ItemOrderCreate, OrderCreate, OrderEntity } from '../types/order';
import { http } from '../service';
import { useNavigate } from 'react-router';

interface OrderData {
    orders: OrderEntity[];
    total: number;
}

export function useOrder() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingUnique, setIsLoadingUnique] = useState<boolean>(true);
    const [dataOrders, setDataOrders] = useState<OrderData>({
        orders: [],
        total: 0,
    });
    const [dataCreateOrder, setDataCreateOrder] = useState<OrderCreate>();

    const navigate = useNavigate();

    async function getOrdersData() {
        setIsLoading(true);
        try {
            const response = await http.get<OrderEntity[]>('/orders');
            if (response.data) {
                setDataOrders({
                    orders: response.data,
                    total: response.data.length,
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function createOrder(employeeId: string) {
        try {
            const response = await http.post('/orders', {
                employee_id: employeeId,
            });
            navigate(`new/${response.data}`);
        } catch (error) {
            console.error(error);
        }
    }

    async function getOrderById(
        id: string,
        setDataOrder: (data: OrderEntity) => void
    ): Promise<void> {
        try {
            const response = await http.get<OrderEntity>(`/orders/${id}`);
            const orderFounded: OrderEntity = response.data;
            setDataOrder(orderFounded);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingUnique(false);
        }
    }

    async function onSubmit(
        id: string | undefined,
        data: OrderCreate | undefined
    ) {
        try {
            const convertData = {
                order_id: id,
                data_items: data?.data_items.map((item: ItemOrderCreate) => ({
                    produto_id: item.product_id,
                    quantity: item.quantity,
                })),
            };

            await http.post('/orders/add-items', convertData);
        } catch (error) {
            console.error(error);
        }
    }

    function handleMinusQuantity(
        setDataSelectedProducts: any,
        productId: string
    ) {
        setDataSelectedProducts(
            (prevOrderData: OrderCreate) =>
                prevOrderData && {
                    ...prevOrderData,
                    data_items: prevOrderData.data_items
                        .map((item) =>
                            item.product_id === productId && item.quantity > 0
                                ? { ...item, quantity: item.quantity - 1 }
                                : item
                        )
                        .filter((item) => item.quantity > 0),
                }
        );
    }

    function handlePlusQuantity(
        setDataSelectedProducts: any,
        productId: string,
        name: string,
        value: number
    ) {
        setDataSelectedProducts((prevOrderData: OrderCreate | undefined) => {
            if (!prevOrderData) return prevOrderData;

            const newItems = prevOrderData.data_items.map((item) => {
                if (item.product_id === productId) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });

            if (!newItems.find((item) => item.product_id === productId)) {
                newItems.push({
                    product_id: productId,
                    product_name: name,
                    quantity: 1,
                    value: value,
                });
            }

            return { ...prevOrderData, data_items: newItems };
        });
    }

    useEffect(() => {
        getOrdersData();
    }, []);

    return {
        dataOrders,
        isLoading,
        isLoadingUnique,
        createOrder,
        getOrderById,
        dataCreateOrder,
        setDataCreateOrder,
        onSubmit,
        handleMinusQuantity,
        handlePlusQuantity,
    };
}
