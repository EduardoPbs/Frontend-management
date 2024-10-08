import { z } from 'zod';
import { http } from '../service';
import { useToast } from '@chakra-ui/react';
import { ProductEntity } from '../types/product';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

interface ProductData {
    products: ProductEntity[];
    total: number;
}

type ofAtr = 'id' | 'ativo' | 'valorOriginal';

export function useProduct() {
    const [status, setStatus] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
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
        codigo: 0,
        nome: '',
        estoque: 0,
        valor: 0,
        valorCompra: 0,
        categorias: [],
    });

    const { id } = useParams();
    const toast = useToast();
    const navigate = useNavigate();

    async function getAllProducts(): Promise<void> {
        try {
            const response = await http.get('/commodities');
            if (response.data) {
                setAllProducts({
                    products: response.data,
                    total: response.data.length,
                });

                const activeProducts: ProductEntity[] = response.data.filter((produto: ProductEntity) => produto.ativo);
                setActiveProducts({
                    products: activeProducts,
                    total: activeProducts.length
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function updateProduct(
        id: string | undefined,
        data: Omit<ProductEntity, ofAtr>
    ): Promise<void> {
        try {
            await http
                .put(`/commodities/${id}`, data)
                .then((res) => console.log(res.data))
                .then(() =>
                    toast({
                        title: 'Sucesso',
                        colorScheme: 'green',
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
            await http.patch(`/commodities/restore/${id}`);
        } catch (err) {
            console.error(err);
        }
    }

    async function disableProduct(id: string): Promise<void> {
        try {
            await http.delete(`/commodities/${id}`);
        } catch (err) {
            console.error(err);
        }
    }

    async function createProduct(
        data: Omit<ProductEntity, ofAtr>
    ): Promise<void> {
        try {
            await http
                .post('/commodities', data)
                .then((res) => console.log(res.data))
                .then(() =>
                    toast({
                        title: 'Sucesso',
                        colorScheme: 'green',
                        description: `O produto foi cadastrado.`,
                        status: 'success',
                        position: 'top-right',
                        isClosable: true,
                        duration: 2000,
                    })
                )
                .then(() => navigate(-1));
        } catch (err: any) {
            const errMessage = err.response.data.message === undefined
                ? err.response?.data?.errors[0]?.defaultMessage
                : 'O produto deve estar em pelo menos 1 categoria.';
            toast({
                title: 'Erro.',
                colorScheme: 'red',
                description: errMessage,
                status: 'warning',
                position: 'top-right',
                isClosable: true,
                duration: 2000,
            });
        }
    }

    async function onSubmit(event: any): Promise<void> {
        // console.log("event: ", event.categorias);
        const product: any = {
            codigo: event.codigo,
            nome: event.nome,
            estoque: Number(event.estoque),
            valor: Number(event.valor),
            valorCompra: Number(event.valorCompra),
            categorias: event.categorias,
            ativo: false
        };
        console.log(product);
        try {
            id ? updateProduct(id, product) : createProduct(product);
        } catch (error: any) {
            toast({
                title: 'Erro',
                colorScheme: 'red',
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

    const ProductFormSchema = z.object({
        codigo: z
            .string({
                required_error: 'Obrigatório.',
            })
            .min(1, { message: 'Deve conter pelo menos 1 caractere.' }),
        nome: z
            .string({
                required_error: 'Obrigatório.',
            })
            .min(3, { message: 'Deve conter pelo menos 3 letras.' }),
        estoque: z
            .string({
                required_error: 'Obrigatório.',
            })
            .min(1, { message: 'Deve conter pelo menos 1 caractere.' }),
        valor: z
            .string({ required_error: 'Obrigatório.' })
            .min(1, { message: 'Deve conter pelo menos 1 caractere.' }),
        valorCompra: z
            .string({ required_error: 'Obrigatório.' })
            .min(1, { message: 'Deve conter pelo menos 1 caractere.' }),
        categorias: z.array(z.string()),
    });

    useEffect(() => {
        getAllProducts();
    }, [status]);

    return {
        getAllProducts,
        activeProducts,
        allProducts,
        setAllProducts,
        newProductData,
        setNewProductData,
        loading,
        stockWarn,
        enableProduct,
        disableProduct,
        updateProduct,
        createProduct,
        ProductFormSchema,
        onSubmit,
        setStatus,
        status
    };
}
