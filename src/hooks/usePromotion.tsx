import { http } from "@/service";
import { PromotionEntity } from "@/types/promotion";
import { useEffect, useState } from "react";
import { z } from "zod";

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

    async function getAllPromotions(): Promise<void> {
        try {
            const response = await http.get<PromotionEntity[]>('/promotions');
            setAllPromotions(response.data);
            setActivePromotions(response.data.filter((promotion: PromotionEntity) => promotion.ativo));
            setDisabledPromotions(response.data.filter((promotion: PromotionEntity) => !promotion.ativo));
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

    async function createPromotion(productId: string, data: CreatePromotion): Promise<void | any> {
        console.log("PRODUCT ID: ", productId);
        console.log(data);
        const createPromotionData: CreatePromotion = {
            porcentagem_desconto: data.porcentagem_desconto,
            inicio: data.inicio,
            fim: data.fim
        };
        try {
            const response = await http.post(`/promotions/create/${productId}`, createPromotionData);
            return response.data;
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

    async function onSubmit(event: any) {
        console.log('OnSubmit: ', event);
        try {
            createPromotion(event.product, {
                porcentagem_desconto: Number(event.discount),
                inicio: event.date?.from,
                fim: event.date?.to
            });
        } catch (error) {
            console.error(error);
        }
    }

    const PromotionFormSchema = z.object({
        product: z.string({ required_error: "Escolha um produto." }),
        date: z.object({
            from: z.date({ required_error: "Escolha uma data válida." }),
            to: z.date({ required_error: "Escolha uma data válida." }),
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
        PromotionFormSchema
    };
}