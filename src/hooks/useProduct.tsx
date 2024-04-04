import { useEffect, useState } from 'react';
import { ProductEntity } from '../types/product';
import { http } from '../service';

interface ProductData {
    products: ProductEntity[];
    total: number;
}

export function useProduct() {
    const [loadingAll, setLoadingAll] = useState<boolean>(true);
    const [loadingActive, setLoadingActive] = useState<boolean>(true);
    const [activeProducts, setActiveProducts] = useState<ProductData>({
        products: [],
        total: 0,
    });
    const [allProducts, setAllProducts] = useState<ProductData>({
        products: [],
        total: 0,
    });

    async function getActiveProductsData(): Promise<void> {
        try {
            const response = await http.get<ProductEntity[]>('/products');
            if (response.data) {
                setActiveProducts({
                    products: response.data,
                    total: response.data.length,
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingActive(false);
        }
    }

    async function getAllProducts(): Promise<void> {
        try {
            const response = await http.get<ProductEntity[]>('/products/all');
            if (response.data) {
                setAllProducts({
                    products: response.data,
                    total: response.data.length,
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAll(false);
        }
    }

    async function enableProduct(id: string) {
        try {
            await http.patch(`/products/${id}`);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }

    async function disableProduct(id: string) {
        try {
            await http.delete(`/products/${id}`);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }

    function stockWarn(quantity: number): string {
        if (quantity < 6) {
            return 'text-primary-hover-red';
        } else if (quantity < 11) {
            return 'text-warning-red';
        }
        return '';
    }

    useEffect(() => {
        getActiveProductsData();
        getAllProducts();
    }, []);

    return {
        activeProducts,
        allProducts,
        loadingActive,
        loadingAll,
        stockWarn,
        enableProduct,
        disableProduct,
    };
}
