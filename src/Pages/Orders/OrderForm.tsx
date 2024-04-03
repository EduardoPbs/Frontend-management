import { http } from '../../service';
import { RowDetail } from '../../components/RowDetail';
import { CellDetail } from '../../components/CellDetail';
import { IconButton } from '../../components/IconButton';
import { PageContainer } from '../../components/PageContainer';
import { ProductEntity } from '../../constants/product';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { ItemOrderCreate, OrderCreate } from '../../constants/order';
import {
    primary_red,
    primary_white,
    primary_hover_red,
} from '../../constants/styles';
import {
    PlusCircle,
    MinusCircle,
    ArchiveRestore,
    ArrowLeftCircle,
} from 'lucide-react';
import {
    Box,
    Card,
    Input,
    Modal,
    Button,
    CardBody,
    useToast,
    ModalBody,
    CardHeader,
    ModalHeader,
    ModalFooter,
    ModalOverlay,
    ModalContent,
    useDisclosure,
    ModalCloseButton,
} from '@chakra-ui/react';

function RowProductsOrder({
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
    const toast = useToast();

    const currQuantity =
        selectedProducts?.find((p) => p.product_id === productId)?.quantity ||
        0;

    function handleMinusQuantity() {
        setSelectedProducts(
            (prevOrderData: OrderCreate) =>
                prevOrderData && {
                    ...prevOrderData,
                    data_items: prevOrderData.data_items
                        .map((item) =>
                            item.product_id === productId && item.quantity > 0
                                ? { ...item, quantity: item.quantity - 1 }
                                : item
                        )
                        .filter((item) => item.quantity > 0),
                }
        );
    }

    function handlePlusQuantity() {
        setSelectedProducts((prevOrderData: OrderCreate | undefined) => {
            if (!prevOrderData) return prevOrderData;

            const newItems = prevOrderData.data_items.map((item) => {
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

            return { ...prevOrderData, data_items: newItems };
        });
    }

    return (
        <RowDetail>
            <CellDetail name='Código' content={code} />
            <CellDetail name='Produto' content={name} />
            <CellDetail
                name='Valor/unidade'
                content={Number(value).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })}
            />
            <CellDetail name='Em estoque' content={quantity} />

            <Box className='flex items-center gap-2'>
                <MinusCircle
                    className='size-6 hover:cursor-pointer hover:text-red-400 duration-150'
                    onClick={handleMinusQuantity}
                />
                <span className='text-2xl text-amber-400 font-bold text-center w-[42px]'>
                    {currQuantity}
                </span>
                <PlusCircle
                    className='size-6 hover:cursor-pointer hover:text-yellow-400 duration-150'
                    onClick={() => {
                        if (quantity === 0 || quantity <= currQuantity) {
                            toast({
                                title: 'Alerta!',
                                description: 'Produto sem estoque suficiente.',
                                status: 'warning',
                                position: 'top-right',
                                duration: 1500,
                                isClosable: true,
                            });
                        } else {
                            handlePlusQuantity();
                        }
                    }}
                />
            </Box>
        </RowDetail>
    );
}

export function OrderForm() {
    const [products, setProducts] = useState<ProductEntity[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [orderData, setOrderData] = useState<OrderCreate>();
    const navigate = useNavigate();
    const { id } = useParams();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = useRef(null);
    const finalRef = useRef(null);

    async function getAllProducts() {
        try {
            const response = await http.get('products');
            setProducts(response.data);
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
        <RowProductsOrder
            key={index}
            name={product.name}
            code={product.code}
            value={product.value}
            quantity={product.stock}
            productId={product.id}
            selectedProducts={orderData?.data_items}
            setSelectedProducts={setOrderData}
        />
    );

    const filteredProducts: any = (
        filterItems.length > 1 ? filterItems : products
    ).map(mapProductToComponent);

    async function onSubmit(data: OrderCreate | undefined) {
        try {
            const convertData = {
                order_id: id,
                data_items: data?.data_items.map((item: ItemOrderCreate) => ({
                    produto_id: item.product_id,
                    quantity: item.quantity,
                })),
            };

            await http.post('/orders/add-items', convertData);
        } catch (error) {
            console.error(error);
        }
    }

    const rowStyle = 'flex-row items-center w-fit gap-2';

    useEffect(() => {
        if (id !== undefined) {
            setOrderData({
                order_id: id,
                data_items: [],
            });
        }
        getAllProducts();
    }, []);

    return (
        <PageContainer title='Nova Venda'>
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
                <Box className='flex items-center'>
                    <Button
                        className='capitalize flex items-center gap-2'
                        width={200}
                        colorScheme='yellow'
                        onClick={() => {
                            onOpen();
                        }}
                    >
                        Finalizar
                        <ArchiveRestore />
                    </Button>
                    <Modal
                        initialFocusRef={initialRef}
                        finalFocusRef={finalRef}
                        isOpen={isOpen}
                        onClose={onClose}
                        motionPreset='slideInTop'
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>
                                Resumo - {orderData?.order_id.slice(0, 8)}
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <CellDetail
                                    name='Itens'
                                    className='w-full'
                                    style='flex flex-col justify-center gap-2'
                                    content={
                                        orderData?.data_items.map(
                                            (item, index: number) => (
                                                <span
                                                    key={index}
                                                    className='flex items-center text-[17.5px] justify-between bg-amber-300 w-full font-semibold px-4 text-black rounded-sm hover:bg-amber-500 duration-150 hover:cursor-default'
                                                >
                                                    <span className=''>
                                                        <span className='text-sm'>
                                                            {item?.product_name}{' '}
                                                            -{' '}
                                                        </span>
                                                        <span className=''>
                                                            {item.quantity} x{' '}
                                                        </span>
                                                        <span className=''>
                                                            R$
                                                            {item.value
                                                                .toFixed(2)
                                                                .replace(
                                                                    '.',
                                                                    ','
                                                                )}
                                                        </span>
                                                    </span>
                                                    <span className='flex items-center justify-between gap-2 max-w-[160px] bg-fuchsia-300/10'>
                                                        <span>= </span>
                                                        {Number(
                                                            item.quantity *
                                                                item.value
                                                        ).toLocaleString(
                                                            'pt-BR',
                                                            {
                                                                style: 'currency',
                                                                currency: 'BRL',
                                                            }
                                                        )}
                                                    </span>
                                                </span>
                                            )
                                        ) || ''
                                    }
                                />
                            </ModalBody>
                            <ModalFooter
                                className='flex items-center bg-zinc-100 gap-2'
                                borderRadius={5}
                            >
                                <Box className='flex items-center gap-2 justify-between w-full'>
                                    <p className='text-lg capitalize font-semibold'>
                                        Total:{' '}
                                        <span className='text-xl font-bold text-end'>
                                            {orderData?.data_items
                                                .reduce(
                                                    (acc, currVal) =>
                                                        currVal.quantity *
                                                            currVal.value +
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
                                        colorScheme='yellow'
                                        onClick={() => {
                                            onSubmit(orderData);
                                            onClose();
                                            navigate('/');
                                        }}
                                    >
                                        Cadastrar
                                    </Button>
                                </Box>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Box>
            </Box>

            <Box>
                <Card className='w-full h-[500px] ' background='black'>
                    <CardHeader className='flex flex-col justify-center text-2xl font-semibold text-white'>
                        <Box className='flex items-center justify-between w-full h-[55px] bg-zinc-100/15 rounded-md px-1'>
                            <CellDetail
                                name='Itens'
                                content={
                                    orderData?.data_items.reduce(
                                        (acc, currVal) =>
                                            currVal.quantity + acc,
                                        0
                                    ) || 0
                                }
                                className={rowStyle}
                                style='text-2xl'
                            />
                            <CellDetail
                                name='Total'
                                content={
                                    orderData?.data_items
                                        .reduce(
                                            (acc, currVal) =>
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
                            />
                            <Button
                                height={8}
                                colorScheme='red'
                                onClick={() =>
                                    setOrderData((prev: any) => {
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
