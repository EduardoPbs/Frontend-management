import { z } from 'zod';
import { http } from '../service';
import { useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router';
import { useCategory } from './useCategory';
import { ProductEntity } from '../types/product';
import { useEffect, useState } from 'react';

interface ProductData {
    products: ProductEntity[];
    total: number;
}

type ofAtr = 'id' | 'active';

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
    const [newProductData, setNewProductData] = useState<
        Omit<ProductEntity, ofAtr>
    >({
        code: 0,
        name: '',
        stock: 0,
        value: 0,
        category: '',
    });

    const { categories } = useCategory();
    const { id } = useParams();
    const toast = useToast();
    const navigate = useNavigate();

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

    async function updateProduct(
        id: string | undefined,
        data: Omit<ProductEntity, ofAtr>
    ): Promise<void> {
        try {
            await http
                .put(`/products/${id}`, data)
                .then((res) => console.log(res.data))
                .then(() =>
                    toast({
                        title: 'Sucesso',
                        colorScheme: 'cyan',
                        description: `O produto foi atualizado.`,
                        status: 'success',
                        position: 'top-right',
                        isClosable: true,
                        duration: 2000,
                    })
                )
                .then(() => navigate(-1));
        } catch (err) {
            console.error(err);
        }
    }

    async function enableProduct(id: string): Promise<void> {
        try {
            await http.patch(`/products/${id}`);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }

    async function disableProduct(id: string): Promise<void> {
        try {
            await http.delete(`/products/${id}`);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }

    async function createProduct(
        data: Omit<ProductEntity, ofAtr>
    ): Promise<void> {
        try {
            await http
                .post('/products', data)
                .then((res) => console.log(res.data))
                .then(() =>
                    toast({
                        title: 'Sucesso',
                        colorScheme: 'cyan',
                        description: `O produto foi cadastrado.`,
                        status: 'success',
                        position: 'top-right',
                        isClosable: true,
                        duration: 2000,
                    })
                )
                .then(() => navigate(-1));
        } catch (err) {
            console.error(err);
        }
    }

    async function onSubmit(event: any): Promise<void> {
        const product: Omit<ProductEntity, ofAtr> = {
            code: event.code,
            name: event.name,
            stock: Number(event.stock),
            value: Number(event.value),
            category: event.category,
        };
        console.log(product);
        try {
            id ? updateProduct(id, product) : createProduct(product);
        } catch (error: any) {
            toast({
                title: 'Erro',
                description: `Falha ao cadastrar o produto: ${error.response?.data?.message}`,
                status: 'error',
                position: 'top-right',
                isClosable: true,
                duration: 3000,
            });
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

    const allCategories: [string, ...string[]] = ['Categorias', ...categories];
    const ProductFormSchema = z.object({
        code: z
            .string({
                required_error: 'Obrigatório.',
            })
            .min(1, { message: 'Deve conter pelo menos 1 caractere.' }),
        name: z
            .string({
                required_error: 'Obrigatório.',
            })
            .min(3, { message: 'Deve conter pelo menos 3 letras.' }),
        stock: z
            .string({
                required_error: 'Obrigatório.',
            })
            .min(1, { message: 'Deve conter pelo menos 1 caractere.' }),
        value: z
            .string({ required_error: 'Obrigatório.' })
            .min(1, { message: 'Deve conter pelo menos 1 caractere.' }),
        category: z.enum(allCategories, {
            errorMap: (_issue, _ctx) => {
                return { message: 'Selecione uma categoria.' };
            },
        }),
    });

    useEffect(() => {
        getActiveProductsData();
        getAllProducts();
    }, []);

    return {
        activeProducts,
        allProducts,
        newProductData,
        setNewProductData,
        loadingActive,
        loadingAll,
        stockWarn,
        enableProduct,
        disableProduct,
        updateProduct,
        createProduct,
        ProductFormSchema,
        onSubmit,
    };
}
