import { http } from '../service';
import { useEmployee } from '@/hooks/useEmployee';
import { EmployeeEntity } from '@/types/employee';
import { useEffect, useState } from 'react';
import { ItemOrderCreate, OrderCreate, OrderEntity } from '../types/order';

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
    const [dataCreateOrder, setDataCreateOrder] = useState<OrderCreate>({
        order_id: '',
        data_items: []
    });
    const [orderItems, setOrderItems] = useState<ItemOrderCreate[]>([]);
    const [currentEmployee, setCurrentEmployee] = useState<EmployeeEntity>();

    const { getEmployeeById } = useEmployee();

    async function getOrdersData() {
        setIsLoading(true);
        try {
            const response = await http.get<OrderEntity[]>('/transactions/type/VENDA');
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

    async function createOrder(employeeId: string, itens: ItemOrderCreate[], purchase: boolean = false): Promise<void | string> {
        if (purchase) {
            try {
                const response = await http.post('/transactions/procurements', {
                    itens: itens,
                    funcionario_id: employeeId,
                });

                return response.data;
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                await http.post('/transactions/sales', {
                    itens: itens,
                    funcionario_id: employeeId,
                }).then((response) => {
                    const saleId: string = response.data.slice(30, 66);
                    http.put(`/transactions/finalize/${saleId}`);
                });
            } catch (error) {
                console.error(error);
            }
        }
    }

    async function getOrderById(
        id: string,
        setDataOrder: (data: OrderEntity) => void
    ): Promise<void> {
        try {
            const [order, items] = await Promise.all([
                http.get<OrderEntity>(`/transactions/${id}`),
                http.get(`/transactions/${id}/items`),
            ]);
            const orderFounded: OrderEntity = order.data;
            await getEmployeeById(orderFounded.funcionario_id, setCurrentEmployee);

            setDataOrder(orderFounded);
            setOrderItems(items.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingUnique(false);
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
                            item.produto_id === productId && item.quantidade > 0
                                ? { ...item, quantidade: item.quantidade - 1 }
                                : item
                        )
                        .filter((item) => item.quantidade > 0),
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

            const newItems: ItemOrderCreate[] = prevOrderData.data_items.map((item: ItemOrderCreate) => {
                if (item.produto_id === productId) {
                    return { ...item, quantidade: item.quantidade + 1 };
                }

                return item;
            });

            if (!newItems.find((item: ItemOrderCreate) => item.produto_id === productId)) {
                newItems.push({
                    produto_id: productId,
                    produto_nome: name,
                    quantidade: 1,
                    valor_unitario: value,
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
        handleMinusQuantity,
        handlePlusQuantity,
        orderItems,
        currentEmployee
    };
}
