export type OrderEntity = {
    id: string;
    total: number;
    items: ItemEntity[];
    createdAt: string;
    updatedAt: string;
    deletedAt: string | undefined | null;
};

type ItemEntity = {
    id: string;
    quantity: number;
    total: number;
    productId: string;
};

/**
 *  {
		"id": "0cd7eef9-5ee3-42c8-9c2e-ac78b68416ee",
		"total": 1010.6,
		"items": [
			{
				"id": "123d1fcd-a998-4628-8278-086ffddc6467",
				"quantity": 92,
				"total": 919.08,
				"productId": "1edb737a-ca9b-4b5e-8a99-03e5f6b74d81"
			},
			{
				"id": "378b3bc3-4d9c-4dce-b332-41f815cc16ef",
				"quantity": 26,
				"total": 91.52,
				"productId": "316ec09a-ae33-4ede-827b-ba474046d9e9"
			}
		],
		"createdAt": "2024-01-03T13:17:15.031Z",
		"updatedAt": "2024-01-03T13:18:07.496Z",
		"deletedAt": null
	}
 */
