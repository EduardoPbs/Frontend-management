import { http } from '../../service';
import { RowDetail } from '../../components/RowDetail';
import { CellDetail } from '../../components/CellDetail';
import { IconButton } from '../../components/IconButton';
import { PageContainer } from '../../components/PageContainer';
import { ProductEntity } from '../../types/product';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ItemPurchaseCreate, PurchaseCreate } from '../../types/purchase';
import {
    primary_hover_red,
    primary_red,
    primary_white,
} from '../../constants/styles';
import {
    ArchiveRestore,
    ArrowLeftCircle,
    MinusCircle,
    PlusCircle,
} from 'lucide-react';
import {
    Box,
    Card,
    Input,
    Button,
    CardBody,
    CardHeader,
    useToast,
} from '@chakra-ui/react';

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
    selectedProducts: ItemPurchaseCreate[] | undefined;
    setSelectedProducts: any;
}) {
    const currQuantity =
        selectedProducts?.find((p) => p.product_id === productId)?.quantity ||
        0;

    function handleMinusQuantity() {
        setSelectedProducts(
            (prevPurchaseData: PurchaseCreate) =>
                prevPurchaseData && {
                    ...prevPurchaseData,
                    data_items: prevPurchaseData.data_items
                        .map((item) =>
                            item.product_id === productId && item.quantity > 0
                                ? { ...item, quantity: item.quantity - 1 }
                                : item
                        )
                        .filter((item) => item.quantity > 0),
                }
        );
    }

    function handleMinus10() {
        setSelectedProducts(
            (prevPurchaseData: PurchaseCreate) =>
                prevPurchaseData && {
                    ...prevPurchaseData,
                    data_items: prevPurchaseData.data_items
                        .map((item) =>
                            item.product_id === productId && item.quantity > 0
                                ? { ...item, quantity: item.quantity - 10 }
                                : item
                        )
                        .filter((item) => item.quantity > 0),
                }
        );
    }

    function handlePlusQuantity() {
        setSelectedProducts((prevPurchaseData: PurchaseCreate | undefined) => {
            if (!prevPurchaseData) return prevPurchaseData;
            const newItems = prevPurchaseData?.data_items.map((item) => {
                if (item.product_id === productId) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });

            if (!newItems.find((item) => item.product_id === productId)) {
                newItems.push({
                    product_id: productId,
                    product_name: name,
                    quantity: 1,
                    value: value,
                });
            }

            return { ...prevPurchaseData, data_items: newItems };
        });
    }

    function handlePlus10() {
        setSelectedProducts((prevPurchaseData: PurchaseCreate | undefined) => {
            if (!prevPurchaseData) return prevPurchaseData;
            const newItems = prevPurchaseData?.data_items.map((item) => {
                if (item.product_id === productId) {
                    return { ...item, quantity: item.quantity + 10 };
                }
                return item;
            });

            if (!newItems.find((item) => item.product_id === productId)) {
                newItems.push({
                    product_id: productId,
                    product_name: name,
                    quantity: 10,
                    value: value,
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
                <Button colorScheme='red' onClick={handleMinus10}>
                    -10
                </Button>
                <MinusCircle
                    className={`size-6 ${
                        currQuantity <= 0
                            ? 'text-zinc-400 hover:cursor-default'
                            : 'hover:text-red-400 hover:cursor-pointer'
                    } duration-150`}
                    onClick={handleMinusQuantity}
                />
                <span className='text-2xl text-amber-400 font-bold text-center w-[42px]'>
                    {currQuantity}
                </span>
                <PlusCircle
                    className='size-6 hover:cursor-pointer hover:text-yellow-400 duration-150'
                    onClick={() => {
                        handlePlusQuantity();
                    }}
                />
                <Button
                    colorScheme='yellow'
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
    const [products, setProducts] = useState<ProductEntity[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [purchaseData, setPurchaseData] = useState<PurchaseCreate>();
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    async function getAllProducts() {
        try {
            const response = await http.get('products');
            setProducts(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function onSubmit() {
        try {
            const convertData = {
                purchase_id: id,
                data_items: purchaseData?.data_items.map(
                    (item: ItemPurchaseCreate) => ({
                        produto_id: item.product_id,
                        quantity: item.quantity,
                    })
                ),
            };

            console.log(id);
            await http
                .post('/purchase/add-items', convertData)
                .then(() => {
                    toast({
                        title: 'Sucesso!',
                        description: 'Compra registrada.',
                        status: 'success',
                        position: 'top-right',
                        duration: 1500,
                        isClosable: true,
                    });
                    navigate(-1);
                })
                .catch((err) => {
                    toast({
                        title: 'Erro!',
                        description: `Falha ao registrar compra: ${err}`,
                        status: 'error',
                        position: 'top-right',
                        duration: 1500,
                        isClosable: true,
                    });
                });
        } catch (error) {
            console.error(error);
        }
    }

    const filterItems: ProductEntity[] = products.filter(
        (product: ProductEntity) =>
            product.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            String(product.code).includes(searchInput)
    );

    const mapProductToComponent = (product: ProductEntity, index: number) => (
        <RowProductsPurchase
            key={index}
            name={product.name}
            code={product.code}
            value={product.value}
            quantity={product.stock}
            productId={product.id}
            selectedProducts={purchaseData?.data_items}
            setSelectedProducts={setPurchaseData}
        />
    );

    const filteredProducts: any = (
        filterItems.length > 1 ? filterItems : products
    ).map(mapProductToComponent);

    const rowStyle = 'flex-row items-center w-fit gap-2';

    useEffect(() => {
        getAllProducts();
        setPurchaseData({
            purchase_id: id ?? '',
            data_items: [],
        });
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
                        bgColor={primary_red}
                        textColor={primary_white}
                        bgHoverColor={primary_hover_red}
                    />

                    <Input
                        width={250}
                        borderColor='orange'
                        focusBorderColor='yellow.400'
                        placeholder='Pesquisar produto...'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchInput(e.target.value)
                        }
                    />
                </div>
                <Button
                    className='capitalize flex items-center gap-2'
                    width={200}
                    colorScheme='yellow'
                    onClick={() => {
                        onSubmit();
                    }}
                >
                    Finalizar
                    <ArchiveRestore />
                </Button>
            </Box>
            <Box>
                <Card className='w-full h-[500px] ' background='black'>
                    <CardHeader className='flex flex-col justify-center text-2xl font-semibold text-white'>
                        <Box className='flex items-center justify-between w-full h-[55px] bg-zinc-100/15 rounded-md px-1'>
                            <CellDetail
                                name='Itens'
                                content={
                                    purchaseData?.data_items.reduce(
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
                                height={8}
                                colorScheme='red'
                                onClick={() =>
                                    setPurchaseData((prev: any) => {
                                        return { ...prev, data_items: [] };
                                    })
                                }
                            >
                                Remover tudo
                            </Button>
                        </Box>
                    </CardHeader>

                    <CardBody className='flex flex-col gap-2 m-2 text-white rounded-md border-2 border-amber-500/50 overflow-hidden overflow-y-scroll scrollbar-hide'>
                        <Box className='flex flex-col gap-2'>
                            {filteredProducts}
                        </Box>
                    </CardBody>
                </Card>
            </Box>
        </PageContainer>
    );
}
