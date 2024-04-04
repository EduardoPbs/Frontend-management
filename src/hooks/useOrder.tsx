import { useEffect, useState } from 'react';
import { OrderEntity } from '../types/order';
import { http } from '../service';

interface OrderData {
    orders: OrderEntity[];
    total: number;
}

export function useOrder() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dataOrders, setDataOrders] = useState<OrderData>({
        orders: [],
        total: 0,
    });

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

    useEffect(() => {
        document.title = 'Management | Home';
        getOrdersData();
    }, []);

    return { dataOrders, isLoading };
}
