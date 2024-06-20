import { ProductEntity } from './product';

export type OrderEntity = {
    funcionario_id: string;
    status: string;
    tipo: string;
    quantidade_itens: number;
    criado_em: string;
    id: string;
    agenda: string | null;
    total: number;
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
    produto_id: string;
    produto_nome: string;
    quantidade: number;
    valor_unitario: number;
};
