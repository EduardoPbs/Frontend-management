import { IconButton } from "@/components/IconButton";
import { PageContainer } from "@/components/PageContainer";
import { useCashRegister } from "@/hooks/useCashRegister";
import { Boxes, FileBox, FilePieChart, Percent, SquareUser } from "lucide-react";
import { useEffect } from "react";

export function Reports() {
    const { historyCashier, getCashierByMonth, setHistoryCashier } = useCashRegister();

    useEffect(() => {
        getCashierByMonth(9, setHistoryCashier)    
    }, [historyCashier]);

    return (
        <PageContainer title='Relatórios'>
            {/* <p className='font-semibold text-center text-xl'>Referente - {String(new Date().getMonth() + 1).padStart(2, "0")}/{new Date().getFullYear()}</p> */}
            <p className='font-semibold text-center text-xl' onClick={() => console.log(historyCashier)}>Referente - 09/2024</p>
            <div className='grid grid-cols-2 items-center justify-center gap-6 w-fit m-auto select-none'>
                {/* <div className='flex flex-wrap items-center gap-2 select-none justify-center m-auto'> */}
                <IconButton
                    to={-1}
                    label='Caixa'
                    className='w-fit p-10 text-lg'
                    icon={FilePieChart}
                />
                <IconButton
                    to='new'
                    label='Vendas'
                    className='w-fit p-10 text-lg'
                    icon={FileBox}
                />
                <IconButton
                    to='new'
                    label='Promoções'
                    className='w-fit p-10 text-lg'
                    icon={Percent}
                />
                <span />
                <IconButton
                    to='new'
                    label='Estoque'
                    className='w-fit p-10 text-lg'
                    icon={Boxes}
                />
                <IconButton
                    to='new'
                    label='Funcionários'
                    className='w-fit p-10 text-lg'
                    icon={SquareUser}
                />
            </div>
        </PageContainer>
    );
}