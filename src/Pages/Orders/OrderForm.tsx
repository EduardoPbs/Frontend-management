import { useOrder } from '../../hooks/useOrder';
import { CellDetail } from '../../components/CellDetail';
import { useProduct } from '../../hooks/useProduct';
import { IconButton } from '../../components/IconButton';
import { PageContainer } from '../../components/PageContainer';
import { ProductEntity } from '../../types/product';
import { RowProductsOrder } from './RowProductsOrder';
import { ItemOrderCreate } from '../../types/order';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { ArchiveRestore, ArrowLeftCircle } from 'lucide-react';
import {
    primary_red,
    primary_white,
    round_default,
    primary_hover_red,
} from '../../constants/styles';
import {
    Box,
    Card,
    Input,
    Modal,
    Button,
    CardBody,
    ModalBody,
    CardHeader,
    ModalHeader,
    ModalFooter,
    ModalOverlay,
    ModalContent,
    useDisclosure,
    ModalCloseButton,
} from '@chakra-ui/react';

export function OrderForm() {
    const { activeProducts } = useProduct();
    const { dataCreateOrder, setDataCreateOrder, onSubmit } = useOrder();
    const [searchInput, setSearchInput] = useState<string>('');
    const navigate = useNavigate();
    const { id } = useParams();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = useRef(null);
    const finalRef = useRef(null);

    const filterItems: ProductEntity[] = activeProducts.products.filter(
        (product: ProductEntity) =>
            searchInput.toLowerCase().includes(product.name.toLowerCase())
    );

    const mapProductToComponent: (
        product: ProductEntity,
        index: number
    ) => JSX.Element = (product: ProductEntity, index: number) => (
        <RowProductsOrder
            key={index}
            name={product.name}
            code={product.code}
            value={product.value}
            quantity={product.stock}
            productId={product.id}
            selectedProducts={dataCreateOrder?.data_items}
            setSelectedProducts={setDataCreateOrder}
        />
    );

    const filteredProducts: ProductEntity[] | JSX.Element[] = (
        filterItems.length > 1 ? filterItems : activeProducts.products
    ).map(mapProductToComponent);

    const rowStyle = 'flex-row items-center w-fit gap-2';

    useEffect(() => {
        if (id !== undefined) {
            setDataCreateOrder({
                order_id: id,
                data_items: [],
            });
        }
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
                        borderColor={primary_hover_red}
                        focusBorderColor={primary_red}
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
                        borderRadius={round_default}
                        backgroundColor={primary_red}
                        color={primary_white}
                        _hover={{
                            bg: primary_hover_red,
                            color: primary_white,
                        }}
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
                                Resumo - {dataCreateOrder?.order_id.slice(0, 8)}
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <CellDetail
                                    name='Itens'
                                    className='w-full'
                                    style='flex flex-col justify-center gap-2'
                                    content={
                                        dataCreateOrder?.data_items.map(
                                            (item, index: number) => (
                                                <span
                                                    key={index}
                                                    className='flex items-center text-[17.5px] justify-between bg-primary-red w-full font-semibold px-4 text-primary-white rounded-round-default hover:bg-primary-hover-red duration-150 hover:cursor-default'
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
                                            {dataCreateOrder?.data_items
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
                                        borderRadius={round_default}
                                        backgroundColor={primary_red}
                                        color={primary_white}
                                        _hover={{
                                            bg: primary_hover_red,
                                            color: primary_white,
                                        }}
                                        onClick={() => {
                                            onSubmit(id, dataCreateOrder);
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

            <Box className='flex border-4 border-border-gray rounded-round-default'>
                <Card className='w-full h-[500px]'>
                    <CardHeader className='flex flex-col justify-center text-2xl font-semibold text-primary-black'>
                        <Box className='flex items-center justify-between w-full h-[55px] bg-zinc-100/15 rounded-round-default px-1'>
                            <CellDetail
                                name='Itens'
                                content={
                                    dataCreateOrder?.data_items.reduce(
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
                                    dataCreateOrder?.data_items
                                        .reduce(
                                            (
                                                acc: number,
                                                currVal: ItemOrderCreate
                                            ) =>
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
