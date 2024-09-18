import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { dynamicMonths } from "@/utils/months";
import { weekDays } from "@/utils/weekDays";
import { http } from "@/service";
import { useEffect, useState } from "react";
import { OrderEntity } from "@/types";

export function OrderChart() {
    const [chartDataMonth, setChartDataMonth] = useState([
        { month: dynamicMonths[weekDays[0].month - 5].month, income: 0 },
        { month: dynamicMonths[weekDays[0].month - 4].month, income: 0 },
        { month: dynamicMonths[weekDays[0].month - 3].month, income: 0 },
        { month: dynamicMonths[weekDays[0].month - 2].month, income: 0 },
        { month: dynamicMonths[weekDays[0].month - 1].month, income: 0 },
        { month: dynamicMonths[weekDays[0].month].month, income: 0 },
    ]);

    const chartConfig = {
        income: {
            label: "Renda",
            color: "#f00",
        },
    } satisfies ChartConfig;
    async function getOrdersByMonth() {
        try {
            const promises = chartDataMonth.map(async (_, i) => {
                const count = 5 - i;
                const res = await http.get(`/transactions/month/${dynamicMonths[weekDays[0].month - count].monthNumber + 1}`);
                const orders: OrderEntity[] = res.data;
                const ordersFiltered: OrderEntity[] = orders.filter((order: OrderEntity) => order.tipo === "VENDA");

                var total: number;
                if (ordersFiltered[count] === undefined) {
                    total = 0;
                }

                total = ordersFiltered.reduce((acc: number, currVal: OrderEntity) => acc += currVal.total, 0);

                return { index: i, total };
            });

            const results = await Promise.all(promises);
            const updatedChartDataMonth = [...chartDataMonth];
            results.forEach(result => {
                if (result) {
                    updatedChartDataMonth[result.index].income = result.total;
                }
            });

            setChartDataMonth(updatedChartDataMonth);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getOrdersByMonth();
    }, []);

    return (
        <Card className=''>
            <CardHeader>
                <CardTitle>Vendas mensais ($)</CardTitle>
                <CardDescription>
                    Mostrando quantidade de vendas dos útlimos 6 meses
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartDataMonth}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={true}
                            axisLine={true}
                            tickMargin={8}
                            tickFormatter={(value: any) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" hideLabel />}
                        />
                        <Area
                            dataKey="income"
                            type="linear"
                            fill="#0000EF"
                            fillOpacity={0.4}
                            stroke="#0000EF"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}


/*

*/