import { http } from "@/service";
import { OrderEntity } from "@/types/order";
import { useEffect, useState } from "react";

interface PurchaseData {
    purchases: OrderEntity[];
    total: number;
}

export function usePurchase() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [purchaseData, setPurchaseData] = useState<PurchaseData>();

    async function getPurchaseData() {
        try {
            const response = await http.get<OrderEntity[]>('/transactions/type/COMPRA');
            setPurchaseData({
                purchases: response.data,
                total: response.data.length,
            });
            sessionStorage.setItem('purchases', JSON.stringify({
                purchases: response.data,
                total: response.data.length,
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function getPurchasesByMonth(month: number, setPurchaseData: (data: PurchaseData) => void) {
        if (month === 0) {
            setPurchaseData(JSON.parse(sessionStorage.getItem('purchases') || ''));
            return;
        }
        try {
            const response = await http.get<OrderEntity[]>(`/transactions/month/${month}`);
            const purchasesFiltered = response.data.filter((purchase: OrderEntity) => purchase.tipo === "COMPRA");
            setPurchaseData({
                purchases: purchasesFiltered,
                total: purchasesFiltered.length
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function getPurchasesByDate(month: number, day: number, setPurchaseData: (data: PurchaseData) => void) {
        if (day === 0) {
            setPurchaseData(JSON.parse(sessionStorage.getItem('purchases') || ''));
            return;
        }

        try {
            const response = await http.get<OrderEntity[]>(`/transactions/date/${month}/${day}`);
            const purchasesFiltered = response.data.filter((purchase: OrderEntity) => purchase.tipo === "COMPRA");
            setPurchaseData({
                purchases: purchasesFiltered,
                total: purchasesFiltered.length
            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getPurchaseData();
    }, []);

    return {
        isLoading,
        getPurchaseData,
        purchaseData,
        setPurchaseData,
        getPurchasesByMonth,
        getPurchasesByDate
    };
}