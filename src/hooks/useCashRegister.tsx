import { http } from '../service';
import { useEffect, useState } from 'react';

export type Movimentacao = {
    criado_em: string;
    valor: number;
};

export type Caixa = {
    id: string;
    abertura: string;
    fechamento: string | null;
    valor_abertura: number;
    valor_atual: number;
    valor_fechamento: number;
};

// interface CashierData {
//     atual: Caixa | null;
//     historico: Caixa[];
//     movimentacoes: Movimentacao[];
//     total: number;
// }

export function useCashRegister() {
    const [currentCashier, setCurrentCashier] = useState<Caixa>({
        id: '',
        abertura: '',
        fechamento: null,
        valor_abertura: 0,
        valor_atual: 0,
        valor_fechamento: 0
    });
    const [historyCashier, setHistoryCashier] = useState<Caixa[]>([]);
    const [allMovements, setAllMovements] = useState<Movimentacao[]>([]);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        getCashierData();
    }, []);

    async function getCashierData() {
        try {
            const [currentCashier, allCashier, allCashierMovements] = await Promise.all([
                http.get<Caixa>('/cashier/current'),
                http.get<Caixa[]>('/cashier/all'),
                http.get<Movimentacao[]>('/cashier/movements/all')
            ]);
            const total = allCashierMovements.data.reduce((acc: number, currVal: Movimentacao) => acc += currVal.valor, 0);

            sessionStorage.setItem('cash_status', JSON.stringify({ open: currentCashier.data.fechamento === null ? true : false }));
            setCurrentCashier(currentCashier.data);
            setHistoryCashier(allCashier.data);
            setAllMovements(allCashierMovements.data);
            setTotal(total);
        } catch (error) {
            console.error(error);
        }
    }

    async function getCurrentCaixa(setCurrentCaixa: (data: any) => void) {
        try {
            const response = await http.get('/cashier/current');
            setCurrentCaixa(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function openCashier(valor_abertura: number, setCurrentCaixa: (data: any) => void) {
        try {
            await http.put('/cashier/open', { valor_abertura });
            getCurrentCaixa(setCurrentCaixa);
            sessionStorage.setItem('cash_status', JSON.stringify({ open: true }));
        } catch (error) {
            console.error(error);
        }
    }

    async function closeCurrentCaixa(setCurrentCaixa: (data: any) => void) {
        try {
            await http.put('/cashier/close');
            getCurrentCaixa(setCurrentCaixa);
            sessionStorage.setItem('cash_status', JSON.stringify({ open: false }));
        } catch (error) {
            console.error(error);
        }
    }

    async function getCashierByMonth(month: number, setCashierData: (data: Caixa[]) => void) {
        if (month === 0) {
            try {
                const response = await http.get<Caixa[]>('/cashier/all');
                setCashierData(response.data);
            } catch (err) {
                console.error(err);
            }
            return;
        }

        try {
            const response = await http.get<Caixa[]>(`cashier/month/${month}`);
            setCashierData(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function getCashierByDate(month: number, day: number, setCashierData: (data: Caixa[]) => void) {
        if (month === 0 && day === 0) {
            try {
                const response = await http.get<Caixa[]>('/cashier/all');
                setCashierData(response.data);
            } catch (err) {
                console.error(err);
            }
        } else if (month !== 0 && day === 0) {
            try {
                const response = await http.get<Caixa[]>(`/cashier/month/${month}`);
                setCashierData(response.data);
            } catch (err) {
                console.error(err);
            }
        } else {
            try {
                const response = await http.get<Caixa[]>(`/cashier/date/${month}-${day}`);
                setCashierData(response.data);
            } catch (error) {
                console.error(error);
            }
        }
    }

    async function getMovementsByMonth(month: number, setMovements: (data: Movimentacao[]) => void) {
        if (month === 0) {
            try {
                const response = await http.get<Movimentacao[]>('/cashier/movements/all');
                setMovements(response.data);
            } catch (err) {
                console.error(err);
            }
            return;
        }

        try {
            const response = await http.get<Movimentacao[]>(`/cashier/movements/month/${month}`);
            setMovements(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function getMovementsByDate(month: number, day: number, setMovements: (data: Movimentacao[]) => void) {
        if (month === 0 && day === 0) {
            try {
                const response = await http.get<Movimentacao[]>('/cashier/movements/all');
                setMovements(response.data);
            } catch (err) {
                console.error(err);
            }
            return;
        } else if (month !== 0 && day === 0) {
            try {
                const response = await http.get<Movimentacao[]>(`/cashier/movements/month/${month}`);
                setMovements(response.data);
            } catch (err) {
                console.error(err);
            }
        } else {
            try {
                const response = await http.get<Movimentacao[]>(`/cashier/movements/data/${month}-${day}`);
                setMovements(response.data);
            } catch (err) {
                console.error(err);
            }
        }
    }

    useEffect(() => {
        getCashierData();
    }, []);

    return {
        currentCashier,
        historyCashier,
        allMovements,
        total,
        closeCurrentCaixa,
        openCashier,
        getCurrentCaixa,
        getCashierByMonth,
        getMovementsByMonth,
        setAllMovements,
        setHistoryCashier,
        getCashierByDate,
        getMovementsByDate
    };
}
