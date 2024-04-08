import { http } from '../../service';
import { LgInput } from '../../components/LgInput';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useProduct } from '../../hooks/useProduct';
import { IconButton } from '../../components/IconButton';
import { useCategory } from '../../hooks/useCategory';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '../../components/PageContainer';
import { Button, Select } from '@chakra-ui/react';
import { ArrowLeftCircle } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import {
    primary_red,
    primary_white,
    primary_hover_red,
    round_default,
} from '../../constants/styles';

export function ProductForm() {
    const { onSubmit, setNewProductData, newProductData, ProductFormSchema } =
        useProduct();
    const { categories } = useCategory();

    const { id } = useParams();

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ProductFormSchema),
        defaultValues: {
            code: newProductData.code || '',
            name: newProductData.name || '',
            stock: newProductData.stock || '',
            value: newProductData.value || '',
            category: newProductData.category || '',
        },
    });

    async function dataProductToUpdate(id: string | undefined) {
        try {
            const response = await http.get(`/products/${id}`);
            setNewProductData({
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

    useEffect(() => {
        if (id !== undefined) {
            dataProductToUpdate(id);
        }
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
                                    focusBorderColor={primary_red}
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
                <Button
                    borderRadius={round_default}
                    backgroundColor={primary_red}
                    color={primary_white}
                    _hover={{
                        bg: primary_hover_red,
                        color: primary_white,
                    }}
                    type='submit'
                >
                    {id ? 'Atualizar' : 'Cadastrar'}
                </Button>
            </form>
        </PageContainer>
    );
}
