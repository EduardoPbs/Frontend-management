import { Button } from '@/components/ui/button';
import { useOrder } from '@/hooks/useOrder';
import { CellDetail } from '../../components/CellDetail';
import { IconButton } from '../../components/IconButton';
import { useProduct } from '@/hooks/useProduct';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router';
import { useEmployee } from '@/hooks/useEmployee';
import { ProductEntity } from '../../types/product';
import { PageContainer } from '../../components/PageContainer';
import { EmployeeEntity } from '@/types';
import { ItemOrderCreate } from '@/types';
import { RowProductsPurchase } from '@/Pages/Purchases/RowProductsPurchse';
import { useEffect, useState } from 'react';
import { primary_red, primary_hover_red } from '../../constants/styles';
import { ArchiveRestore, ArrowLeftCircle, X } from 'lucide-react';
import { Box, Card, Input, CardBody, useToast, CardHeader } from '@chakra-ui/react';
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

export function PurchaseForm() {
    const [searchInput, setSearchInput] = useState<string>('');
    const [selectedEmployee, setSelectedEmployee] = useState<{ id: string, nome: string; }>({ id: '', nome: '' });
    const { dataCreateOrder, setDataCreateOrder, createOrder } = useOrder();
    const { dataEmployees } = useEmployee();
    const { activeProducts } = useProduct();
    const navigate = useNavigate();
    const toast = useToast();

    const filterItems: ProductEntity[] = activeProducts.products.filter((product: ProductEntity) => {
        return product.nome.toLowerCase().match(searchInput.toLowerCase());
    });

    const rowStyle = 'flex-row items-center w-fit gap-2';

    useEffect(() => {
        setDataCreateOrder({ order_id: '', data_items: [] });
    }, [searchInput]);

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

                                        createOrder(selectedEmployee.id, '', dataCreateOrder.data_items, true)
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
                            {filterItems ? filterItems.map((product: ProductEntity, index: number) => (
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
                            )) : activeProducts.products.map((product: ProductEntity, index: number) => (
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
                            ))}
                        </Box>
                    </CardBody>
                </Card>
            </Box>
        </PageContainer>
    );
}
