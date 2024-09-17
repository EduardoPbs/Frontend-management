import { ProductEntity } from "@/types/product";

export type PromotionEntity = {
    id: string;
    produto: ProductEntity;
    desconto: number;
    ativo: boolean;
    data_inicio: string;
    data_fim: string;
}