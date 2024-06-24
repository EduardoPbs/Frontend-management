import { http } from "@/service";
import { PromotionEntity } from "@/types/promotion";
import { useEffect, useState } from "react";

export function usePromotion() {
    const [allPromotions, setAllPromotions] = useState<PromotionEntity[]>([]);
    const [activePromotions, setAllActivePromotions] = useState<PromotionEntity[]>([]);
    const [disabledPromotions, setDisabledPromotions] = useState<PromotionEntity[]>([]);

    async function getAllPromotions() {
        try {
            const response = await http.get<PromotionEntity[]>('/promotions');
            setAllPromotions(response.data);
            setAllActivePromotions(response.data.filter((promotion: PromotionEntity) => promotion.ativo));
            setDisabledPromotions(response.data.filter((promotion: PromotionEntity) => !promotion.ativo));
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAllPromotions();
    }, []);

    return {
        allPromotions,
        activePromotions,
        disabledPromotions
    };
}