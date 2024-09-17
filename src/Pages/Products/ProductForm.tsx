import { http } from '../../service';
import { LgInput } from '../../components/LgInput';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router';
import { useProduct } from '../../hooks/useProduct';
import { IconButton } from '../../components/IconButton';
import { useCategory } from '../../hooks/useCategory';
import { zodResolver } from '@hookform/resolvers/zod';
import { primary_red } from '../../constants/styles';
import { PageContainer } from '../../components/PageContainer';
import { ArrowLeftCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Modal,
    Select,
    ModalBody,
    ModalHeader,
    ModalFooter,
    ModalContent,
    ModalOverlay,
    useDisclosure,
    ModalCloseButton,
} from '@chakra-ui/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Content } from '@/components/Content';

export function ProductForm() {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const { id } = useParams();
    const { categories } = useCategory();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { onSubmit, newProductData, setNewProductData, ProductFormSchema } = useProduct();

    const {
        reset,
        control,
        setValue,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(ProductFormSchema),
        defaultValues: {
            codigo: newProductData.codigo || '',
            nome: newProductData.nome || '',
            estoque: newProductData.estoque || '',
            valor: newProductData.valor || '',
            categorias: newProductData.categorias || selectedCategories,
        },
    });

    function handleSelectChange(event: any) {
        console.log(event)
        setSelectedCategory(event.target.value);
    };

    function handleClick() {
        console.log(selectedCategories);
        if (!selectedCategories.includes(selectedCategory) && selectedCategory != '') {
            setSelectedCategories((prevCategories: string[]) => {
                const updatedCategories: string[] = [...prevCategories, selectedCategory];
                return updatedCategories;
            });
        }
    };

    async function dataProductToUpdate(id: string | undefined) {
        try {
            const response = await http.get(`/commodities/${id}`);
            console.log(response.data);
            setSelectedCategories(response.data.categorias);
            setNewProductData({
                codigo: response.data.codigo,
                nome: response.data.nome,
                estoque: response.data.estoque,
                valor: response.data.valor,
                categorias: response.data.categorias,
            });

            reset({
                codigo: response.data.codigo,
                nome: response.data.nome,
                estoque: String(response.data.estoque),
                valor: String(response.data.valor),
                categorias: selectedCategories,
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

    useEffect(() => {
        setValue('categorias', selectedCategories);
    }, [selectedCategories]);

    return (
        <PageContainer title={id ? 'Atualizar' : 'Cadastro'}>
            <IconButton
                to={-1}
                label='Voltar'
                className='w-fit'
                icon={ArrowLeftCircle}
            />
            <Content className='w-full flex items-center overflow-auto'>
                <Card className="bg-white dark:bg-gray-900 w-[600px]">
                    <div className="max-w-2xl p-4 py-1 mx-auto">
                        <CardHeader className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                            <CardTitle>
                                Novo Produto
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className='flex flex-col gap-4 w-full'
                            >
                                <div className='flex items-center w-full gap-4'>
                                    <LgInput
                                        label='Código'
                                        type='number'
                                        name='codigo'
                                        placeholder='0001'
                                        errors={errors.codigo}
                                        control={control}
                                        autoComplete='disabled'
                                    />
                                    <LgInput
                                        label='Nome'
                                        name='nome'
                                        placeholder='Batata'
                                        errors={errors.nome}
                                        control={control}
                                        autoComplete='disabled'
                                    />
                                </div>

                                <div className='flex items-center w-full gap-4'>
                                    <LgInput
                                        label='Estoque'
                                        name='estoque'
                                        placeholder='5'
                                        errors={errors.estoque}
                                        control={control}
                                        autoComplete='disabled'
                                    />
                                    <LgInput
                                        label='Valor'
                                        type='number'
                                        name='valor'
                                        placeholder='1.25'
                                        errors={errors.valor}
                                        control={control}
                                        autoComplete='disabled'
                                    />
                                    <>
                                        <div className='relative'>
                                            <Button
                                                type='button'
                                                className='w-full mt-6 hover:bg-primary-hover-red'
                                                onClick={onOpen}
                                            >
                                                Selecionar categorias
                                            </Button>
                                            <div className='absolute cursor-default flex justify-center items-center -right-1 top-4 bg-primary-white size-6 rounded-full border-2 border-primary-red'>
                                                <p className='text-primary-red font-bold pb-1'>
                                                    {selectedCategories.length}
                                                </p>
                                            </div>
                                        </div>

                                        <Modal isOpen={isOpen} onClose={onClose}>
                                            <ModalOverlay />
                                            <ModalContent>
                                                <ModalHeader>Categorias</ModalHeader>
                                                <ModalCloseButton />
                                                <ModalBody>
                                                    <div>
                                                        <Controller
                                                            name='categorias'
                                                            control={control}
                                                            render={({ field }) => {
                                                                return (
                                                                    <div className='flex-col justify-center w-full'>
                                                                        <Select
                                                                            {...field}
                                                                            focusBorderColor={primary_red}
                                                                            placeholder='Selecione uma categoria'
                                                                            value={selectedCategory}
                                                                            onChange={handleSelectChange}
                                                                        >
                                                                            {categories.map(
                                                                                (category: string, index: number) => {
                                                                                    return (
                                                                                        <option
                                                                                            key={index}
                                                                                            value={category.toUpperCase()}
                                                                                            className='text-black capitalize'
                                                                                        >
                                                                                            {category.toLowerCase().replace('_', ' ')}
                                                                                        </option>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </Select>
                                                                    </div>
                                                                );
                                                            }}
                                                        />
                                                        {errors && (
                                                            <p className='text-red-500'>{errors.categorias?.message}</p>
                                                        )}
                                                    </div>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <div className='flex items-center w-full justify-between'>
                                                        <div className='flex flex-col justify-center gap-2 w-1/2 capitalize'>
                                                            {selectedCategories.length > 0 ?
                                                                selectedCategories.map((category, index: number) => {
                                                                    return (
                                                                        <p
                                                                            key={index}
                                                                            className='w-full bg-primary-white hover:bg-primary-black/5 border-2 border-primary-black/50 rounded-md p-2 duration-150'
                                                                        >
                                                                            <span className='flex items-center justify-between gap-3 text-black font-semibold'>
                                                                                {category.toLowerCase().replace('_', ' ')}
                                                                                <X
                                                                                    className='cursor-pointer hover:scale-95 hover:text-primary-red duration-100'
                                                                                    onClick={() => {
                                                                                        setSelectedCategories(selectedCategories.filter(c => c != category));
                                                                                    }}
                                                                                />
                                                                            </span>
                                                                        </p>
                                                                    );
                                                                }) : <></>}
                                                        </div>
                                                        <Button
                                                            className='hover:bg-primary-hover-red'
                                                            // borderRadius={round_default}
                                                            // backgroundColor={primary_red}
                                                            // color={primary_white}
                                                            // _hover={{
                                                            //     bg: primary_hover_red,
                                                            //     color: primary_white,
                                                            // }}
                                                            onClick={handleClick}
                                                        >
                                                            Adicionar
                                                        </Button>
                                                    </div>
                                                </ModalFooter>
                                            </ModalContent>
                                        </Modal>
                                    </>
                                </div>
                                <Button
                                    className='hover:bg-primary-hover-red'
                                    type='submit'
                                >
                                    {id ? 'Atualizar' : 'Cadastrar'}
                                </Button>
                            </form>
                        </CardContent>
                    </div>
                </Card>
            </Content>
        </PageContainer >
    );
};
