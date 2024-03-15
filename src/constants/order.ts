import { ProductEntity } from './product';

export type OrderEntity = {
    id: string;
    total: number;
    items: ItemEntity[];
    employee: {
        id: string;
        name: string;
    };
    date: string;
};

export type ItemEntity = {
    id: string;
    quantity: number;
    total: number;
    product: ProductEntity;
};

export type OrderCreate = {
    order_id: string;
    data_items: ItemOrderCreate[];
};

export type ItemOrderCreate = {
    product_id: string;
    product_name: string;
    quantity: number;
    value: number;
};
