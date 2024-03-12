import { ProductEntity } from "./product";

export type OrderEntity = {
    id: string;
    total: number;
    items: ItemEntity[];
    employee: {
        id: string; 
        name: string;
    }
	date: string;
};

export type ItemEntity = {
    id: string;
    quantity: number;
    total: number;
    product: ProductEntity;
};
