import { http } from "@/service";
import { OrderEntity } from "@/types";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface StockData {
    entrances: OrderEntity[];
    pullouts: OrderEntity[];
    total: number;
}

export type ProductStockCreateType = {
    produto_id: string;
    quantidade: number;
};

export function useStock() {
    const [dataStock, setDataStock] = useState<StockData>();
    const toast = useToast();
    const navigate = useNavigate();

    async function getEntrances() {
        try {
            const [entrances, pullouts] = await Promise.all([
                http.get<OrderEntity[]>('/transactions/type/ENTRADA_PRODUTO'),
                http.get<OrderEntity[]>('/transactions/type/RETIRADA_PRODUTO')
            ]);

            setDataStock({
                entrances: entrances.data,
                pullouts: pullouts.data,
                total: entrances.data.length + pullouts.data.length,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Erro!',
                colorScheme: 'red',
                description: `Algo deu errado.`,
                status: 'warning',
                position: 'top-right',
                isClosable: true,
                duration: 2000,
            });
        }
    }

    async function getStockByMonth(month: number, setStockData: (data: StockData) => void) {
        if (month === 0) {
            getEntrances();
            return;
        }
        try {
            const response = await http.get<OrderEntity[]>(`/transactions/month/${month}`);
            const stockEntranceFiltered = response.data.filter((order: OrderEntity) => order.tipo === "ENTRADA_PRODUTO");
            const stockPulloutFiltered = response.data.filter((order: OrderEntity) => order.tipo === "RETIRADA_PRODUTO");
            setStockData({
                entrances: stockEntranceFiltered,
                pullouts: stockPulloutFiltered,
                total: stockEntranceFiltered.length + stockPulloutFiltered.length
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function createEntrance(employeeId: string, itens: ProductStockCreateType[]): Promise<void | string> {
        console.log(employeeId);
        console.log(itens);
        try {
            await http.post('/transactions/stock/entrance', {
                itens: itens,
                funcionario_id: employeeId
            }).then((response) => {
                const entranceId: string = response.data.slice(32, 68);
                http.put(`/transactions/finalize/${entranceId}`);
                toast({
                    title: 'Sucesso!',
                    colorScheme: 'green',
                    // description: `Entrada registrada com sucesso.`,
                    description: response.data,
                    status: 'success',
                    position: 'top-right',
                    isClosable: true,
                    duration: 2000,
                });

                navigate(-1);
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Erro!',
                colorScheme: 'red',
                description: `Algo deu errado. Entrada não efetuada.`,
                status: 'warning',
                position: 'top-right',
                isClosable: true,
                duration: 2000,
            });
        }
    }

    async function createPullout(employeeId: string, itens: ProductStockCreateType[]): Promise<void | string> {
        try {
            await http.post('/transactions/stock/pullout', {
                itens: itens,
                funcionario_id: employeeId
            }).then((response) => {
                console.log(response.data);
                toast({
                    title: 'Sucesso!',
                    colorScheme: 'green',
                    // description: `Registrada registrada com sucesso.`,
                    description: response.data,
                    status: 'success',
                    position: 'top-right',
                    isClosable: true,
                    duration: 2000,
                });

                navigate(-1);
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Erro!',
                colorScheme: 'red',
                description: `Algo deu errado. Entrada não efetuada.`,
                status: 'warning',
                position: 'top-right',
                isClosable: true,
                duration: 2000,
            });
        }
    }

    useEffect(() => {
        getEntrances();
    }, []);

    return {
        createEntrance,
        createPullout,
        dataStock,
        setDataStock,
        getStockByMonth
    };
}
