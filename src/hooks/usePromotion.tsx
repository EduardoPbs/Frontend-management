import { z } from "zod";
import { http } from "@/service";
import { useNavigate } from "react-router";
import { PromotionEntity } from "@/types/promotion";
import { addDays, addHours } from "date-fns";
import { useEffect, useState } from "react";

interface CreatePromotion {
    porcentagem_desconto: number;
    inicio: string;
    fim: string;
}

export function usePromotion() {
    const [allPromotions, setAllPromotions] = useState<PromotionEntity[]>([]);
    const [activePromotions, setActivePromotions] = useState<PromotionEntity[]>([]);
    const [disabledPromotions, setDisabledPromotions] = useState<PromotionEntity[]>([]);
    const [productPromotions, setProductPromotions] = useState<PromotionEntity[]>([]);
    const [loadingUnique, setIsLoaginUnique] = useState<boolean>(true);
    const navigate = useNavigate();

    async function getAllPromotions(): Promise<void> {
        try {
            const response = await http.get<PromotionEntity[]>('/promotions');
            setAllPromotions(response.data);
            setActivePromotions(response.data.filter((promotion: PromotionEntity) => promotion.ativo));
            setDisabledPromotions(response.data.filter((promotion: PromotionEntity) => !promotion.ativo));

            sessionStorage.setItem('promotions', JSON.stringify(response.data));
        } catch (error) {
            console.error(error);
        }
    }

    async function getProductPromotion(productId: string): Promise<void> {
        try {
            const response = await http.get(`/promotions/product/${productId}`);
            setProductPromotions(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function getPromotionById(
        promotionId: string,
        setPromotionData: (data: PromotionEntity) => void
    ): Promise<void> {
        try {
            const response = await http.get<PromotionEntity>(`/promotions/${promotionId}`);
            setPromotionData(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoaginUnique(false);
        }
    }

    async function createPromotion(productId: string, data: CreatePromotion): Promise<void | any> {
        const createPromotionData: CreatePromotion = {
            porcentagem_desconto: data.porcentagem_desconto,
            inicio: data.inicio,
            fim: data.fim
        };
        try {
            await http.post(`/promotions/create/${productId}`, createPromotionData)
                .then((res) => {
                    navigate(-1);
                    return res.data;
                });
        } catch (error) {
            console.error(error);
        }
    }

    async function enablePromotion(promotionId: string): Promise<string | void> {
        try {
            const response = await http.patch(`/promotions/active/${promotionId}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    async function disablePromotion(promotionId: string): Promise<string | void> {
        try {
            const response = await http.patch(`/promotions/disable/${promotionId}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    async function deletePromotion(promotionId: string): Promise<void> {
        try {
            const response = await http.delete(`/promotions/${promotionId}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    async function onSubmit(productId: string, discount: number | string, date: any) {
        const initialDate: Date = !date?.from
            ? new Date(new Date().getTime())
            : new Date(new Date(date.from).getTime() || '');

        initialDate.setHours(new Date().getHours() - 3);
        initialDate.setMinutes(new Date().getMinutes());

        const finalizeDate: Date = !date?.to
            ? addDays(addHours(new Date(new Date().getTime()), 8), 2)
            : new Date(date?.to || '');

        finalizeDate.setHours(new Date().getHours() + 8);
        finalizeDate.setMinutes(new Date().getMinutes());

        try {
            createPromotion(productId, {
                porcentagem_desconto: Number(discount),
                inicio: initialDate.toISOString(),
                fim: finalizeDate.toISOString()
            });
        } catch (error) {
            console.error(error);
        }
    }

    const PromotionFormSchema = z.object({
        product: z.string({ required_error: "Escolha um produto." }),
        date: z.object({
            from: z.any(),
            to: z.any()
        }),
        discount: z.string({ required_error: "Escolha um valor válido." })
            .min(1, { message: "O valor mínimo deve ser pelo menos 1." })
    });

    useEffect(() => {
        getAllPromotions();
    }, []);

    return {
        allPromotions,
        activePromotions,
        disabledPromotions,
        createPromotion,
        getProductPromotion,
        productPromotions,
        enablePromotion,
        disablePromotion,
        onSubmit,
        PromotionFormSchema,
        getPromotionById,
        loadingUnique,
        deletePromotion
    };
}