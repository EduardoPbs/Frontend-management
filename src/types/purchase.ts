export type PurchaseCreate = {
    purchase_id: string;
    data_items: ItemPurchaseCreate[];
};

export type ItemPurchaseCreate = {
    product_id: string;
    product_name: string;
    quantity: number;
    value: number;
};
