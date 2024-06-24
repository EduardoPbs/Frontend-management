import { IconButton } from "@/components/IconButton";
import { PromotionAll } from "@/Pages/Promotions/promotion-all";
import { PageContainer } from "@/components/PageContainer";
import { BadgePlus, Settings2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromotionActive } from "@/Pages/Promotions/promotion-active";
import { PromotionFinish } from "@/Pages/Promotions/promotion-finish";

export function Promotions() {

    return (
        <PageContainer title="Promoções">
            <div className='flex items-center gap-2 select-none'>
                <IconButton
                    to='/new'
                    label='Criar'
                    className='w-fit'
                    icon={BadgePlus}
                />
                <IconButton
                    to='/management'
                    label='Gerenciar'
                    className='w-fit'
                    icon={Settings2}
                />
            </div>
            <Tabs defaultValue="all" className="flex flex-col justify-center gap-2">
                <div className="flex flex-col gap-2 justify-start h-screen">
                    <TabsList className='bg-zinc-300 select-none size-fit'>
                        <TabsTrigger value="all">Todos</TabsTrigger>
                        <TabsTrigger value="active">Ativos</TabsTrigger>
                        <TabsTrigger value="finished">Finalizados</TabsTrigger>
                    </TabsList>
                    <PromotionAll />
                    <PromotionActive />
                    <PromotionFinish />
                </div>
            </Tabs>
        </PageContainer >
    );
}