import { Title } from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Content } from "@/components/Content";
import { useNavigate, useParams } from "react-router";
import { IconButton } from "@/components/IconButton";
import { usePromotion } from "@/hooks/usePromotion";
import { PageContainer } from "@/components/PageContainer";
import { FinalizeButton } from "@/Pages/Promotions/finalize_button";
import { PromotionEntity } from "@/types/promotion";
import { toFullLocaleDate } from "@/utils/toFullLocaleDate";
import { useEffect, useState } from "react";
import { ArrowLeftCircle, Trash2, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogHeader,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { LgSpinner } from "@/components/LgSpinner";

export function PromotionDetail() {
    const [promotion, setPromotion] = useState<PromotionEntity>();
    const { id } = useParams();
    const { getPromotionById, loadingUnique } = usePromotion();

    useEffect(() => {
        if (id !== undefined) {
            getPromotionById(id, setPromotion);
        }
    }, []);

    if (loadingUnique) {
        return (
            <LgSpinner />
        );
    }

    return (
        <PageContainer title="Promoção">
            <IconButton
                to={-1}
                label='Voltar'
                className='w-fit'
                icon={ArrowLeftCircle}
            />

            <Content className='w-full overflow-auto'>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center w-full">
                        <CardTitle>Registro - {promotion?.id}</CardTitle>
                        <CardDescription className="flex items-center gap-2 text-lg font-bold text-black uppercase">
                            <p>Status:{" "}</p>
                            <span className={`text-xl normal-case ${promotion?.ativo ? 'text-agreed-green' : 'text-custom-red'}`}>
                                {promotion?.ativo ? "Em andamento" : "Desativado"}
                            </span>
                        </CardDescription>
                        <div className='flex items-center gap-2'>
                            <FinalizeButton
                                id={promotion?.id || ''}
                                status={promotion?.ativo || false}
                                onTrueText="Marcar como FINALIZADO"
                                onFalseText="Marcar como ATIVO"
                            />
                            <DeletePromotionButton id={promotion?.id || ''} />
                        </div>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between font-bold">
                        <div>
                            <p className='uppercase text-md'>Desconto(%): <span className='text-xl text-amber-600'>{promotion?.desconto}</span></p>
                            <p className='uppercase text-md'>Produto:</p>
                            <div className='flex flex-col justify-center pl-4'>
                                <span>Nome: <span className='text-xl'>{promotion?.produto.nome}</span></span>
                                <span>Valor original: <span className='text-xl'>{promotion?.produto.valorOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></span>
                                <span>Valor c/ desconto: <span className='text-xl'>{promotion?.produto.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></span>
                                <span>Em estoque: <span className='text-xl'>{promotion?.produto.estoque}</span></span>
                                <span>Status: <span className={`${promotion?.produto.ativo ? 'text-agreed-green' : 'text-custom-red'}`}>
                                    {promotion?.produto.ativo ? "Ativo" : "Desativado"}
                                </span></span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className='flex justify-end w-full'>
                        <div className='font-bold text-lg'>
                            <p>Início: <span className='text-xl'>{toFullLocaleDate(promotion?.data_inicio || '')}</span></p>
                            <p className='flex justify-between'>Fim: <span className='text-xl'>{toFullLocaleDate(promotion?.data_fim || '')}</span></p>
                        </div>
                    </CardFooter>
                </Card>
            </Content>
        </PageContainer>
    );
}

function DeletePromotionButton({ id }: { id: string; }) {
    const { deletePromotion } = usePromotion();
    const navigate = useNavigate();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className='w-[200px] capitalize flex items-center justify-start gap-2 hover:bg-primary-hover-red'>
                    <Trash2 />
                    Excluir Promoção
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className='flex items-center justify-between'>
                        <Title variant='h3'>Excluir a promoção atual?</Title>
                        <AlertDialogCancel><X /></AlertDialogCancel>
                    </div>
                </AlertDialogHeader>
                <AlertDialogDescription className='max-h-[300px]'>
                    <span className='text-xl text-black font-semibold'>
                        A {' '}
                        <span className='text-primary-red uppercase'>
                            promoção atual
                        </span> será excluída permanentemente. Continuar?</span>
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogAction asChild>
                        <Button
                            className='hover:bg-primary-hover-red'
                            onClick={() => {
                                navigate(-1);
                                deletePromotion(id);
                            }}
                        >
                            Excluir promoção
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
