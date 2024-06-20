import { http } from '../service';
import { useEffect, useState } from 'react';

export type Movimentacao = {
    criado_em: string;
    valor: number;
};

export type Caixa = {
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
        } catch (error) {
            console.error(error);
        }
    }

    async function closeCurrentCaixa(setCurrentCaixa: (data: any) => void) {
        try {
            await http.put('/cashier/close');
            getCurrentCaixa(setCurrentCaixa);
        } catch (error) {
            console.error(error);
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
        getCurrentCaixa
    };
}
