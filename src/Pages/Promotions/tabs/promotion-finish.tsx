import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router";
import { usePromotion } from "@/hooks/usePromotion";
import { FinalizeButton } from "@/Pages/Promotions/finalize_button";
import { PromotionEntity } from "@/types/promotion";
import { toFullLocaleDate } from "@/utils/toFullLocaleDate";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function PromotionFinish() {
    const { disabledPromotions } = usePromotion();
    const navigate = useNavigate();

    return (
        <TabsContent value="disable">
            {disabledPromotions.length > 0 ? <ScrollArea className="w-auto h-[525px] ">
                <div className='flex gap-4 w-full h-full flex-wrap p-2'>
                    {disabledPromotions.map((promotion: PromotionEntity, index: number) => {
                        return (
                            <Card className='min-w-[300px] w-[360px] hover:shadow-md transition-all hover:scale-[102%] cursor-default' key={index}>
                                <CardHeader>
                                    <CardTitle className='font-bold uppercase text-primary-black'>{promotion.produto.nome} - {promotion.id.slice(0, 8)}</CardTitle>
                                    <CardDescription className='flex flex-col font-semibold text-md'>
                                        <span>Desconto: <span className='text-xl font-bold text-amber-600'>{promotion.desconto}%</span></span>
                                        <span>Status: <span className={`font-bold text-xl ${promotion.ativo ? 'text-agreed-green' : 'text-custom-red'}`}>
                                            {promotion.ativo ? 'Em andamento' : 'Desativado'}
                                        </span>
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className='flex flex-col justify-center gap-2 font-semibold'>
                                    <span className='uppercase'>Início: <span className='font-bold'>{toFullLocaleDate(promotion.data_inicio)}</span></span>
                                    <span className='uppercase'>Fim: <span className='font-bold'>{toFullLocaleDate(promotion.data_fim)}</span></span>
                                </CardContent>
                                <CardFooter className='flex items-center gap-2'>
                                    <Button
                                        className="hover:bg-primary-hover-red w-1/2"
                                        onClick={() => { navigate(`${promotion.id}`); }}
                                    >
                                        Detalhes
                                    </Button>
                                    <FinalizeButton id={promotion.id} status={promotion?.ativo} />
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </ScrollArea> : <h2 className='text-black'>Nenhuma promoção foi finalizada.</h2>}
        </TabsContent>
    );
}