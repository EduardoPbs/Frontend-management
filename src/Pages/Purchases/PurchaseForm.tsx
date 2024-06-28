import { Button } from '@/components/ui/button';
import { useOrder } from '@/hooks/useOrder';
import { RowDetail } from '../../components/RowDetail';
import { CellDetail } from '../../components/CellDetail';
import { IconButton } from '../../components/IconButton';
import { useProduct } from '@/hooks/useProduct';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router';
import { useEmployee } from '@/hooks/useEmployee';
import { ProductEntity } from '../../types/product';
import { PageContainer } from '../../components/PageContainer';
import { EmployeeEntity } from '@/types';
import { useEffect, useState } from 'react';
import { ItemOrderCreate, OrderCreate } from '@/types';
import { custom_red, primary_red, primary_hover_red } from '../../constants/styles';
import { Box, Card, Input, CardBody, useToast, CardHeader } from '@chakra-ui/react';
import { PlusCircle, MinusCircle, ArchiveRestore, ArrowLeftCircle, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogTrigger,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';

function RowProductsPurchase({
    name,
    code,
    value,
    quantity,
    productId,
    selectedProducts,
    setSelectedProducts,
}: {
    name: string;
    code: number;
    value: number;
    quantity: number;
    productId: string;
    selectedProducts: ItemOrderCreate[] | undefined;
    setSelectedProducts: any;
}) {
    const currQuantity =
        selectedProducts?.find((p) => p.produto_id === productId)?.quantidade ||
        0;

    function handleMinusQuantity() {
        setSelectedProducts(
            (prevPurchaseData: OrderCreate) =>
                prevPurchaseData && {
                    ...prevPurchaseData,
                    data_items: prevPurchaseData.data_items
                        .map((item: ItemOrderCreate) =>
                            item.produto_id === productId && item.quantidade > 0
                                ? { ...item, quantidade: item.quantidade - 1 }
                                : item
                        )
                        .filter((item: ItemOrderCreate) => item.quantidade > 0),
                }
        );
    }

    function handleMinus10() {
        setSelectedProducts(
            (prevPurchaseData: OrderCreate) =>
                prevPurchaseData && {
                    ...prevPurchaseData,
                    data_items: prevPurchaseData.data_items
                        .map((item: ItemOrderCreate) =>
                            item.produto_id === productId && item.quantidade > 0
                                ? { ...item, quantidade: item.quantidade - 10 }
                                : item
                        )
                        .filter((item: ItemOrderCreate) => item.quantidade > 0),
                }
        );
    }

    function handlePlusQuantity() {
        setSelectedProducts((prevPurchaseData: OrderCreate | undefined) => {
            if (!prevPurchaseData) return prevPurchaseData;
            const newItems = prevPurchaseData?.data_items.map((item: ItemOrderCreate) => {
                if (item.produto_id === productId) {
                    return { ...item, quantidade: item.quantidade + 1 };
                }
                return item;
            });

            if (!newItems.find((item: ItemOrderCreate) => item.produto_id === productId)) {
                newItems.push({
                    produto_id: productId,
                    produto_nome: name,
                    quantidade: 1,
                    valor_unitario: value,
                });
            }

            return { ...prevPurchaseData, data_items: newItems };
        });
    }

    function handlePlus10() {
        setSelectedProducts((prevPurchaseData: OrderCreate | undefined) => {
            if (!prevPurchaseData) return prevPurchaseData;
            const newItems = prevPurchaseData?.data_items.map((item: ItemOrderCreate) => {
                if (item.produto_id === productId) {
                    return { ...item, quantidade: item.quantidade + 10 };
                }
                return item;
            });

            if (!newItems.find((item: ItemOrderCreate) => item.produto_id === productId)) {
                newItems.push({
                    produto_id: productId,
                    produto_nome: name,
                    quantidade: 10,
                    valor_unitario: value,
                });
            }

            return { ...prevPurchaseData, data_items: newItems };
        });
    }

    return (
        <RowDetail>
            <CellDetail name='Código' content={code} />
            <CellDetail name='Produto' content={name} />
            <CellDetail name='No estoque' content={quantity} />
            <Box className='flex items-center gap-2'>
                <Button
                    className='hover:bg-primary-hover-red'
                    onClick={handleMinus10}
                >
                    -10
                </Button>
                <MinusCircle
                    className={`size-6 ${currQuantity <= 0
                        ? 'text-zinc-400 hover:cursor-default'
                        : 'hover:text-primary-red hover:cursor-pointer'
                        } duration-150`}
                    onClick={handleMinusQuantity}
                />
                <span className='text-2xl text-primary-red font-bold text-center w-[42px]'>
                    {currQuantity}
                </span>
                <PlusCircle
                    className='size-6 hover:cursor-pointer hover:text-primary-red duration-150'
                    onClick={() => {
                        handlePlusQuantity();
                    }}
                />
                <Button
                    className='hover:bg-primary-hover-red'
                    onClick={() => {
                        handlePlus10();
                    }}
                >
                    +10
                </Button>
            </Box>
        </RowDetail>
    );
}

export function PurchaseForm() {
    const [searchInput, setSearchInput] = useState<string>('');
    const [selectedEmployee, setSelectedEmployee] = useState<{ id: string, nome: string; }>({ id: '', nome: '' });
    const { dataCreateOrder, setDataCreateOrder, createOrder } = useOrder();
    const { dataEmployees } = useEmployee();
    const { allProducts } = useProduct();
    const navigate = useNavigate();
    const toast = useToast();

    const filterItems: ProductEntity[] = allProducts.products.filter(
        (product: ProductEntity) =>
            product.nome.toLowerCase().includes(searchInput.toLowerCase()) ||
            String(product.codigo).includes(searchInput)
    );

    const mapProductToComponent = (product: ProductEntity, index: number) => (
        <RowProductsPurchase
            key={index}
            name={product.nome}
            code={product.codigo}
            value={product.valor}
            quantity={product.estoque}
            productId={product.id}
            selectedProducts={dataCreateOrder?.data_items}
            setSelectedProducts={setDataCreateOrder}
        />
    );

    const filteredProducts: any = (
        filterItems.length > 1 ? filterItems : allProducts.products
    ).map(mapProductToComponent);

    const rowStyle = 'flex-row items-center w-fit gap-2';

    useEffect(() => {
        setDataCreateOrder({ order_id: '', data_items: [] });
    }, []);

    return (
        <PageContainer title='Nova Compra'>
            <Box className='flex items-center gap-4 w-full justify-between'>
                <div className='flex items-center gap-12'>
                    <IconButton
                        to={-1}
                        label='Voltar'
                        className='w-fit'
                        icon={ArrowLeftCircle}
                    />

                    <Input
                        width={250}
                        borderColor={primary_hover_red}
                        _hover={{
                            borderColor: custom_red,
                        }}
                        focusBorderColor={primary_red}
                        placeholder='Pesquisar produto...'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchInput(e.target.value)
                        }
                    />
                    <Select
                        onValueChange={(event) => {
                            const employeeData: { id: string; nome: string; } = JSON.parse(event);
                            setSelectedEmployee({
                                id: employeeData.id,
                                nome: employeeData.nome
                            });
                        }}
                    >
                        <SelectTrigger className='w-[180px] font-semibold'>
                            <SelectValue placeholder="Funcionário" />
                        </SelectTrigger>
                        <SelectContent className='max-h-[200px] font-semibold'>
                            {dataEmployees.map((employee: EmployeeEntity, index: number) => {
                                return (
                                    <SelectItem key={index} value={JSON.stringify({ id: employee.id, nome: employee.nome })}>
                                        {employee.nome}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild disabled={dataCreateOrder?.data_items.length < 1}>
                        <Button className='capitalize flex items-center gap-2 hover:bg-primary-hover-red'>
                            Finalizar
                            <ArchiveRestore />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <div className='flex flex-col items-start w-full justify-center text-xl font-semibold border-b-2 pb-4'>
                                <div className='flex items-center w-full justify-between'>
                                    <h2>
                                        Funcionário: {' '}
                                        <span className='uppercase text-primary-red'>
                                            {selectedEmployee.nome || 'selecione um funcionário'}
                                        </span>
                                    </h2>
                                    <AlertDialogCancel><X /></AlertDialogCancel>
                                </div>
                                <h3 className=''>Resumo:</h3>
                            </div>
                        </AlertDialogHeader>
                        <ScrollArea>
                            <AlertDialogDescription className='max-h-[300px]'>
                                <span className='flex flex-col w-full gap-2 items-center'>
                                    {dataCreateOrder?.data_items.map(
                                        (item, index: number) => (
                                            <span
                                                key={index}
                                                className='flex flex-col items-start gap-3 justify-center py-4 bg-primary-white w-full min-h-[65px] font-semibold px-4 text-primary-black rounded-sm hover:bg-zinc-200 duration-150 hover:cursor-default border-red-400 border-l-4'
                                            >
                                                <span className='text-lg font-semibold w-full border-b-2 border-primary-black uppercase'>
                                                    {item.quantidade}
                                                    <span className='text-md lowercase'>x{' '}</span>
                                                    {item?.produto_nome}
                                                </span>
                                                <span className='flex items-center justify-between gap-2 w-full'>
                                                    <span className='text-xl'>
                                                        R$ {' '}
                                                        {item.valor_unitario.toFixed(2).replace('.', ',')}
                                                    </span>
                                                    <span className='flex items-center justify-between gap-2 text-2xl max-w-[160px] bg-fuchsia-300/10'>
                                                        <span>= </span>
                                                        {Number(item.quantidade * item.valor_unitario)
                                                            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </span>
                                                </span>
                                            </span>
                                        )
                                    ) || ''
                                    }
                                </span>
                            </AlertDialogDescription>
                        </ScrollArea>
                        <AlertDialogFooter>
                            <div className='flex items-center justify-between bg-zinc-200 gap-2 w-full rounded-md p-2'>
                                <p className='text-lg capitalize font-semibold'>
                                    Total:{' '}
                                    <span className='text-xl font-bold text-end'>
                                        {dataCreateOrder?.data_items
                                            .reduce(
                                                (acc, currVal: ItemOrderCreate) =>
                                                    currVal.quantidade *
                                                    currVal.valor_unitario +
                                                    acc,
                                                0
                                            )
                                            .toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            })}
                                    </span>
                                </p>
                                <Button
                                    className='hover:bg-primary-hover-red'
                                    onClick={() => {
                                        if (!selectedEmployee.id || selectedEmployee.id === '') {
                                            toast({
                                                title: 'Aviso!',
                                                description: `Escolha um funcionário.`,
                                                status: 'info',
                                                position: 'top-right',
                                                duration: 1500,
                                                isClosable: true,
                                            });
                                            return;
                                        }

                                        createOrder(selectedEmployee.id, dataCreateOrder.data_items, true)
                                            .then((response) => {
                                                toast({
                                                    title: 'Sucesso!',
                                                    description: String(response),
                                                    status: 'success',
                                                    position: 'top-right',
                                                    duration: 1500,
                                                    isClosable: true,
                                                });
                                            }).then(() => {
                                                setTimeout(() => {
                                                    navigate(-1);
                                                }, 2000);
                                            });;
                                    }}
                                >
                                    Cadastrar
                                </Button>
                            </div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Box>
            <Box className='flex border-4 border-border-gray rounded-round-default'>
                <Card className='w-full h-[500px]'>
                    <CardHeader className='flex flex-col justify-center text-2xl font-semibold text-primary-black'>
                        <Box className='flex items-center justify-between w-full h-[55px] bg-zinc-100/15 rounded-round-default px-1'>
                            <CellDetail
                                name='Itens'
                                content={
                                    dataCreateOrder?.data_items.reduce(
                                        (acc, currVal: any) =>
                                            currVal.quantity + acc,
                                        0
                                    ) || 0
                                }
                                className={rowStyle}
                                style='text-2xl'
                            />
                            {/* <CellDetail
                                name='Total'
                                content={
                                    purchaseData?.data_items
                                        .reduce(
                                            (acc, currVal: any) =>
                                                currVal.quantity *
                                                    currVal.value +
                                                acc,
                                            0
                                        )
                                        .toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        }) || 0
                                }
                                className={rowStyle}
                                style='text-2xl'
                            /> */}
                            <Button
                                className='hover:bg-primary-hover-red'
                                onClick={() =>
                                    setDataCreateOrder((prev: any) => {
                                        return { ...prev, data_items: [] };
                                    })
                                }
                            >
                                Remover tudo
                            </Button>
                        </Box>
                    </CardHeader>

                    <CardBody className='flex flex-col gap-2 m-2 text-primary-black rounded-md border-2 border-border-gray overflow-hidden overflow-y-scroll scrollbar-hide'>
                        <Box className='flex flex-col gap-2'>
                            {filteredProducts}
                        </Box>
                    </CardBody>
                </Card>
            </Box>
        </PageContainer>
    );
}
