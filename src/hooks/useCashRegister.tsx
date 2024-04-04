import { http } from '../service';
import { CashActivity } from '../types';
import { useEffect, useState } from 'react';

interface CashRegisterData {
    activities: CashActivity[];
    amount: number;
}

export function useCashRegister() {
    const [cashRegisterData, setCashRegisterData] = useState<CashRegisterData>({
        activities: [],
        amount: 0,
    });

    async function getCashRegisterData() {
        try {
            const [respTotal, respAct] = await Promise.all([
                http.get<number>('/cash-register/balance'),
                http.get<CashActivity[]>('/cash-register/all-activities'),
            ]);
            setCashRegisterData({
                activities: respAct.data,
                amount: respTotal.data,
            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCashRegisterData();
    }, []);

    return { cashRegisterData };
}
