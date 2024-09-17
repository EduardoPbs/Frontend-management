import { IconButton } from "@/components/IconButton";
import { PageContainer } from "@/components/PageContainer";
import { BadgePlus, Settings2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromotionActive, PromotionAll, PromotionFinish } from "@/Pages/Promotions/tabs";
import { useEffect } from "react";
import { usePromotion } from "@/hooks/usePromotion";

export function Promotions() {
    const { } = usePromotion();

    useEffect(() => {
        document.title = 'Management | Promoções';
    }, []);

    return (
        <PageContainer title="Promoções">
            <div className='flex items-center gap-2 select-none'>
                <IconButton
                    to='new'
                    label='Criar'
                    className='w-fit'
                    icon={BadgePlus}
                />
                {/* <IconButton
                    to='/management'
                    label='Gerenciar'
                    className='w-fit'
                    icon={Settings2}
                /> */}
            </div>
            <Tabs defaultValue="all" className="flex flex-col justify-center gap-2">
                <div className="flex flex-col gap-2 justify-start h-screen">
                    <TabsList className='bg-zinc-300 select-none size-fit'>
                        <TabsTrigger className='font-semibold' value="all">Todos</TabsTrigger>
                        <TabsTrigger className='font-semibold' value="active">Andamento</TabsTrigger>
                        <TabsTrigger className='font-semibold' value="disable">Finalizadas</TabsTrigger>
                    </TabsList>
                    <PromotionAll />
                    <PromotionActive />
                    <PromotionFinish />
                </div>
            </Tabs>
        </PageContainer >
    );
}