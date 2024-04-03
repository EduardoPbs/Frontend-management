import { z } from 'zod';
import { http } from '../../service';
import { LgInput } from '../../components/LgInput';
import { IconButton } from '../../components/IconButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '../../components/PageContainer';
import { ArrowLeftCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { Button, Select, useToast } from '@chakra-ui/react';
import {
    primary_red,
    primary_white,
    primary_hover_red,
} from '../../constants/styles';

export interface ProductEntity {
    code: number | undefined;
    name: string;
    stock: number;
    value: number;
    category: string;
}

export function ProductForm() {
    const [categories, setCategories] = useState<string[]>([]);
    const [productData, setProductData] = useState({
        code: '',
        name: '',
        stock: '',
        value: '',
        category: '',
    });
    const allCategories: [string, ...string[]] = ['Categorias', ...categories];
    const navigate = useNavigate();
    const toast = useToast();
    const { id } = useParams();

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

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ProductFormSchema),
        defaultValues: {
            code: productData.code || '',
            name: productData.name || '',
            stock: productData.stock || '',
            value: productData.value || '',
            category: productData.category || '',
        },
    });

    async function dataProductToUpdate(id: string | undefined) {
        try {
            const response = await http.get(`/products/${id}`);
            setProductData({
                code: response.data.code,
                name: response.data.name,
                stock: response.data.stock,
                value: response.data.value,
                category: response.data.category,
            });

            reset({
                code: response.data.code,
                name: response.data.name,
                stock: String(response.data.stock),
                value: String(response.data.value),
                category: response.data.category,
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function getCategories() {
        try {
            const response = await http.get('/products/categories');
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function updateProduct(id: string | undefined, data: ProductEntity) {
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

    async function createProduct(data: ProductEntity) {
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

    async function onSubmit(event: any) {
        const product: ProductEntity = {
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

    useEffect(() => {
        if (id !== undefined) {
            dataProductToUpdate(id);
        }

        getCategories();
    }, []);

    return (
        <PageContainer title={id ? 'Atualizar' : 'Cadastro'}>
            <IconButton
                to={-1}
                label='Voltar'
                className='w-fit'
                icon={ArrowLeftCircle}
                bgColor={primary_red}
                textColor={primary_white}
                bgHoverColor={primary_hover_red}
            />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-col gap-4 w-full'
            >
                <div className='flex items-center w-full gap-4'>
                    <LgInput
                        label='Código'
                        type='number'
                        name='code'
                        placeholder='0001'
                        errors={errors.code}
                        control={control}
                        autoComplete='disabled'
                    />
                    <LgInput
                        label='Nome'
                        name='name'
                        placeholder='Batata'
                        errors={errors.name}
                        control={control}
                        autoComplete='disabled'
                    />
                </div>

                <div className='flex items-center w-full gap-4'>
                    <LgInput
                        label='Estoque'
                        type='number'
                        name='stock'
                        placeholder='5'
                        errors={errors.stock}
                        control={control}
                        autoComplete='disabled'
                    />
                    <LgInput
                        label='Valor'
                        type='number'
                        name='value'
                        placeholder='1.25'
                        errors={errors.value}
                        control={control}
                        autoComplete='disabled'
                    />
                    <Controller
                        name='category'
                        control={control}
                        render={({ field }) => (
                            <div className='flex-col justify-center w-full'>
                                <label htmlFor='category'>Categoria</label>
                                <Select
                                    {...field}
                                    id='category'
                                    focusBorderColor='yellow.500'
                                    placeholder='Selecione uma categoria'
                                >
                                    {categories.map(
                                        (category: string, index: number) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={category.toUpperCase()}
                                                    className='text-black'
                                                >
                                                    {category
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        category
                                                            .slice(1)
                                                            .toLowerCase()}
                                                </option>
                                            );
                                        }
                                    )}
                                </Select>
                                {errors && (
                                    <p className='text-red-500'>
                                        {errors.category?.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                </div>
                <Button colorScheme='yellow' type='submit'>
                    {id ? 'Atualizar' : 'Cadastrar'}
                </Button>
            </form>
        </PageContainer>
    );
}
