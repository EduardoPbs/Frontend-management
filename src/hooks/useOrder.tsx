import { http } from '../service';
import { useEmployee } from '@/hooks/useEmployee';
import { EmployeeEntity } from '@/types';
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
                sessionStorage.setItem('orders', JSON.stringify({
                    orders: response.data,
                    total: response.data.length,
                }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function createOrder(employeeId: string, payment_form: string, itens: ItemOrderCreate[], purchase: boolean = false): Promise<void | string> {
        if (purchase) {
            try {
                const response = await http.post('/transactions/procurements', {
                    itens: itens,
                    funcionario_id: employeeId
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
                    forma_pagamento: payment_form
                }).then((response) => {
                    const saleId: string = response.data.slice(30, 66);
                    http.put(`/transactions/finalize/${saleId}`);
                });
            } catch (error) {
                console.error(error);
            }
        }
    }

    async function getOrderByEmployeeId(employeeId: string, setOrdersData: (data: any) => void) {
        try {
            const response = await http.get<OrderEntity[]>(`/transactions/employee/${employeeId}`);
            setOrdersData(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getOrderByMonth(month: number, setOrderData: (data: OrderData) => void) {
        if (month === 0) {
            setOrderData(JSON.parse(sessionStorage.getItem('orders') || ''));
            return;
        }
        try {
            const response = await http.get<OrderEntity[]>(`/transactions/month/${month}`);
            const ordersFiltered = response.data.filter((order: OrderEntity) => order.tipo === "VENDA");
            setOrderData({
                orders: ordersFiltered,
                total: ordersFiltered.length
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function getOrderByDate(month: number, day: number, setOrderData: (data: OrderData) => void) {
        if (month === 0 && day === 0) {
            setOrderData(JSON.parse(sessionStorage.getItem('orders') || ''));
        } else if (month !== 0 && day === 0) {
            const response = await http.get<OrderEntity[]>(`/transactions/month/${month}`);
            const ordersFiltered = response.data.filter((order: OrderEntity) => order.tipo === "VENDA");
            setOrderData({
                orders: ordersFiltered,
                total: ordersFiltered.length
            });
        } else {
            try {
                const response = await http.get<OrderEntity[]>(`/transactions/date/${month}/${day}`);
                const ordersFiltered = response.data.filter((order: OrderEntity) => order.tipo === "VENDA");
                setOrderData({
                    orders: ordersFiltered,
                    total: ordersFiltered.length
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
        setDataOrders,
        isLoading,
        isLoadingUnique,
        createOrder,
        getOrderById,
        dataCreateOrder,
        setDataCreateOrder,
        handleMinusQuantity,
        handlePlusQuantity,
        orderItems,
        currentEmployee,
        getOrderByEmployeeId,
        getOrderByMonth,
        getOrderByDate,
    };
}
