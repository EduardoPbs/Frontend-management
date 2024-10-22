import { z } from 'zod';
import { http } from '@/service';
import { Title } from '@/components/Title';
import { Button } from '@/components/ui/button';
import { LgInput } from '@/components/LgInput';
import { useForm } from 'react-hook-form';
import { useOrder } from '../../hooks/useOrder';
import { CellDetail } from '../../components/CellDetail';
import { useProduct } from '../../hooks/useProduct';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconButton } from '../../components/IconButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEmployee } from '@/hooks/useEmployee';
import { PageContainer } from '../../components/PageContainer';
import { ProductEntity } from '../../types/product';
import { UsePaymentType } from '@/hooks/usePaymentType';
import { ItemOrderCreate } from '../../types/order';
import { RowProductsOrder } from './RowProductsOrder';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button as ChakraButton } from '@chakra-ui/react';
import { ArchiveRestore, ArrowLeftCircle, X } from 'lucide-react';
import { EmployeeEntity, UserData, UserLogin } from '@/types';
import { Box, Card, Input, CardBody, CardHeader, useToast } from '@chakra-ui/react';
import { primary_red, primary_hover_red, primary_black, primary_white } from '../../constants/styles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogFooter, AlertDialogHeader, AlertDialogCancel, AlertDialogTrigger, AlertDialogContent, AlertDialogAction, AlertDialogDescription } from '@/components/ui/alert-dialog';

export function OrderForm() {
    const { activeProducts } = useProduct();
    const { dataCreateOrder, setDataCreateOrder, createOrder } = useOrder();
    const { paymentTypes } = UsePaymentType();
    const { dataEmployees } = useEmployee();
    const [searchInput, setSearchInput] = useState<string>('');
    const [paymentType, setPaymentType] = useState<string>('');
    const [moneyValue, setMoneyValue] = useState<number>(0);
    const [moneyBack, setMoneyBack] = useState<number>(0);
    const [isAuth, setIsAuth] = useState<boolean>();
    const navigate = useNavigate();
    const { id } = useParams();
    const toast = useToast();

    const currentUser: UserData = JSON.parse(sessionStorage.getItem('user') || "");
    const [selectedEmployee, setSelectedEmployee] = useState<{ id: string, nome: string; }>({
        id: currentUser.id,
        nome: currentUser.name
    });

    const filterItems: ProductEntity[] = activeProducts.products.filter((product: ProductEntity) => {
        return product.nome.toLowerCase().match(searchInput.toLowerCase());
    });

    const total: number = dataCreateOrder?.data_items
        .reduce((acc, currVal) => currVal.quantidade * currVal.valor_unitario + acc, 0);


    function calculateMoneyBack(value: number, total: number): void {
        return setMoneyBack(value - total);
    }

    const filteredProducts = dataCreateOrder.data_items.filter((item: ItemOrderCreate) => {
        if (filterItems.filter((product: ProductEntity) => product.id === item.produto_id && (product.estoque <= 1 || item.quantidade >= product.estoque)).length > 0) {
            return item;
        }
    });

    const rowStyle = 'flex-row items-center w-fit gap-2';

    useEffect(() => {
        if (id !== undefined) {
            setDataCreateOrder({
                order_id: id,
                data_items: [],
            });
        }
    }, [searchInput]);

    useEffect(() => { }, [isAuth]);

    return (
        <PageContainer title='Nova Venda'>
            <div className='flex items-center gap-4 w-full justify-between'>
                <div className='flex items-center gap-12'>
                    <IconButton
                        to={-1}
                        label='Voltar'
                        className='w-fit'
                        icon={ArrowLeftCircle}
                    />

                    <Select
                        onValueChange={(event) => {
                            const employeeData: { id: string; nome: string; } = JSON.parse(event);
                            setSelectedEmployee({
                                id: employeeData.id,
                                nome: employeeData.nome
                            });
                        }}
                        value={JSON.stringify(selectedEmployee)}
                    >
                        <SelectTrigger className='w-[180px] font-semibold'>
                            <SelectValue placeholder="Funcionário" />
                        </SelectTrigger>
                        <SelectContent className='max-h-[200px] font-semibold'>
                            {dataEmployees.map((employee: EmployeeEntity, index: number) => {
                                if (Number(employee.id) === 0) return;
                                return (
                                    <SelectItem key={index} value={JSON.stringify({ id: employee.id, nome: employee.nome })}>
                                        {employee.nome}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>

                    <Select
                        onValueChange={(event) => {
                            setPaymentType(event);
                        }}
                    >
                        <SelectTrigger className='w-[180px] font-semibold'>
                            <SelectValue placeholder="Pagamento" />
                        </SelectTrigger>
                        <SelectContent className='max-h-[200px] font-semibold'>
                            {paymentTypes.map((payment_type: string, index: number) => {
                                return (
                                    <SelectItem key={index} value={payment_type}>
                                        {payment_type.replace('_', ' ')}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild disabled={dataCreateOrder.data_items.length < 1}>
                        <Button className='capitalize flex items-center gap-2 hover:bg-primary-hover-red'>
                            Finalizar
                            <ArchiveRestore />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <div className='flex flex-col items-start w-full justify-center text-xl font-semibold border-b-2 pb-4'>
                                <div className='flex flex-col gap-2 w-full'>
                                    <div className='flex items-center justify-between'>
                                        <h2>
                                            Funcionário: {' '}
                                            <span className='text-nowrap uppercase text-primary-red'>
                                                {selectedEmployee.nome || 'Não selecionado'}
                                            </span>
                                        </h2>
                                        <h2>
                                            Forma Pgto.: {' '}
                                            <span className='text-nowrap uppercase text-primary-red'>
                                                {paymentType.replace('_', ' ') || 'Não selecionado'}
                                            </span>
                                        </h2>
                                        <AlertDialogCancel
                                            className='w-fit'
                                            onClick={() => {
                                                setMoneyValue(0);
                                                setMoneyBack(0);
                                            }}
                                        >
                                            <X />
                                        </AlertDialogCancel>
                                    </div>

                                    {paymentType === 'DINHEIRO' &&
                                        <div className='flex flex-col justify-center gap-2'>
                                            <div className='flex items-center gap-2'>
                                                <Input
                                                    width={250}
                                                    borderColor={primary_hover_red}
                                                    focusBorderColor={primary_red}
                                                    type='number'
                                                    placeholder='Valor em dinheiro'
                                                    className='my-2'
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        setMoneyValue(Number(e.target.value))
                                                    }
                                                />
                                                <Button
                                                    className='capitalize hover:bg-primary-hover-red'
                                                    onClick={() => calculateMoneyBack(moneyValue, total)}
                                                >
                                                    Calcular troco
                                                </Button>
                                            </div>

                                            <p className='capitalize'>
                                                Troco: {''}
                                                <span className='text-2xl text-primary-hover-red'>
                                                    {moneyBack.toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })}
                                                </span>
                                            </p>
                                        </div>
                                    }
                                </div>
                                <h3>Resumo:</h3>
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
                                                (acc, currVal) =>
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
                                {filteredProducts.length > 0 && !isAuth
                                    ? <VerifyLastProduct setIsAuth={setIsAuth} />
                                    : <Button
                                        className='hover:bg-primary-hover-red'
                                        onClick={() => {
                                            if (selectedEmployee.id === undefined || selectedEmployee.id === '') {
                                                toast({
                                                    title: 'Aviso!',
                                                    colorScheme: 'red',
                                                    description: 'Você deve escolher um funcionário.',
                                                    position: 'top-right',
                                                    status: 'warning',
                                                    isClosable: true,
                                                });
                                                return;
                                            }

                                            if (paymentType === undefined || paymentType === '') {
                                                toast({
                                                    title: 'Aviso!',
                                                    colorScheme: 'red',
                                                    description: 'Você deve escolher uma forma de pagamento.',
                                                    position: 'top-right',
                                                    status: 'warning',
                                                    isClosable: true,
                                                });
                                                return;
                                            }
                                            createOrder(selectedEmployee.id, paymentType, dataCreateOrder.data_items);
                                            setMoneyBack(0);
                                            setMoneyValue(0);
                                            navigate('/');
                                            sessionStorage.removeItem('authenticable');
                                        }}
                                    >
                                        Cadastrar
                                    </Button>
                                }
                            </div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <Box className='flex border-4 border-border-gray rounded-round-default'>
                <Card className='w-full h-[500px]'>
                    <CardHeader className='flex flex-col justify-center text-2xl font-semibold text-primary-black'>
                        <Box className='flex items-center justify-between w-full h-[55px] bg-zinc-100/15 rounded-round-default px-1'>
                            <div className='flex flex-col justify-center'>
                                <CellDetail
                                    name='Itens'
                                    content={dataCreateOrder?.data_items.reduce((acc, currVal) => currVal.quantidade + acc, 0) || 0}
                                    className={rowStyle}
                                    style='text-2xl'
                                />
                                <Input
                                    width={250}
                                    borderColor={primary_hover_red}
                                    focusBorderColor={primary_red}
                                    placeholder='Pesquisar por produto...'
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setSearchInput(e.target.value)
                                    }
                                />
                            </div>
                            <CellDetail
                                name='Total'
                                content={dataCreateOrder?.data_items
                                    .reduce((acc: number, currVal: ItemOrderCreate) => currVal.quantidade * currVal.valor_unitario + acc, 0)
                                    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 0
                                }
                                className={rowStyle}
                                style='text-2xl'
                            />
                            <Button
                                disabled={dataCreateOrder.data_items.length < 1}
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
                    <CardBody className='grid grid-cols-2 overflow-hidden'>
                        <Box className='flex flex-col gap-2 col-span-1 p-2 text-primary-black rounded-md border-2 border-border-gray overflow-hidden'>
                            <ScrollArea>
                                {filterItems ? filterItems.map((product: ProductEntity, index: number) => (
                                    <RowProductsOrder
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
                                    <RowProductsOrder
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
                            </ScrollArea>
                        </Box>
                        <Box className='flex flex-col justify-start gap-2 overflow-hidden bg-light-gray/10 rounded-md border-2 border-border-gray p-2 col-span-1 mx-2'>
                            <ScrollArea className=''>
                                {dataCreateOrder?.data_items.length < 1 ?
                                    <span className='flex justify-center w-full font-semibold'>
                                        Produtos selecionados aparecerão aqui.
                                    </span> :
                                    dataCreateOrder?.data_items.map(
                                        (item, index: number) => (
                                            <span
                                                key={index}
                                                className='flex flex-col items-start gap-3 mb-1 justify-center py-4 bg-primary-white w-full min-h-[65px] font-semibold px-4 text-primary-black rounded-sm hover:bg-zinc-200 hover:shadow-md hover:scale-[101%] duration-150 hover:cursor-default border-red-400 border-l-4'
                                            >
                                                <span className='text-lg font-semibold w-full border-b-2 border-primary-black uppercase'>
                                                    <span className="text-2xl font-bold">{item.quantidade}</span>
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
                            </ScrollArea>
                        </Box>
                    </CardBody>
                </Card>
            </Box>
        </PageContainer >
    );
}

function VerifyLastProduct({ setIsAuth }: { setIsAuth: (state: boolean) => void; }) {
    const [loading, setLoading] = useState<boolean>(false);

    const closeButtonRef = useRef(null);

    const loginFormSchema = z.object({
        email: z.string().email({ message: 'Email inválido!' }),
        password: z.string().min(1, { message: 'Senha obrigatória.' }),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: 'eduardo@hotmail.com',
            password: '123',
        },
    });

    const toast = useToast();

    async function onSubmit(event: UserLogin) {
        setLoading(true);
        const credentials: UserLogin = {
            email: event.email,
            password: event.password,
        };

        try {
            await http
                .post('/auth/login', credentials)
                .then((res) => {
                    const JwtToken = res.data.token;
                    const tokenPayload = JSON.parse(atob(JwtToken.split('.')[1]));

                    setIsAuth(Boolean(tokenPayload.adm));
                    if (tokenPayload.adm) {
                        toast({
                            title: 'Autenticado!',
                            position: 'top-right',
                            status: 'success',
                            isClosable: true,
                        });
                    } else {
                        toast({
                            title: 'Falha ao realizar autenticação!',
                            description: 'O usuário informado não é um administrador.',
                            position: 'top-right',
                            status: 'error',
                            isClosable: true,
                        });
                    }
                });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Falha ao realizar autenticação!',
                description: 'Erro ao verificar login do administrador.',
                position: 'top-right',
                status: 'error',
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className='capitalize flex items-center justify-start gap-2 hover:bg-primary-hover-red'>
                    Solicitar Administrador
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className='flex items-center justify-between'>
                        <Title variant='h3'>Últimos produtos em estoque</Title>
                        <AlertDialogCancel><X /></AlertDialogCancel>
                    </div>
                    <p>Alguns produtos selecionados são os útlimos em estoque.<br />
                        Informe o login de um Administrador para prosseguir.

                    </p>
                </AlertDialogHeader>
                <AlertDialogDescription asChild className='max-h-[300px]'>
                    <form
                        className="border-2 py-4 px-6 rounded-md  mx-auto grid w-[400px] gap-3"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="grid gap-2 text-start">
                            <h1 className="text-2xl font-bold">Autenticação</h1>
                        </div>
                        <LgInput
                            label='Email Administrador'
                            type='email'
                            name='email'
                            placeholder='administrador@email.com'
                            errors={errors.email}
                            control={control}
                            autoComplete='disabled'
                        />
                        <LgInput
                            label='Senha'
                            type='password'
                            name='password'
                            placeholder='******'
                            errors={errors.password}
                            control={control}
                            autoComplete='disabled'
                        />
                        <AlertDialogCancel asChild>
                            <ChakraButton
                                rounded={`6`}
                                _hover={{
                                    bg: primary_hover_red,
                                    color: 'white'
                                }}
                                color={primary_white}
                                backgroundColor={primary_black}
                                isLoading={loading}
                                loadingText='Carregando...'
                                borderRadius={4}
                                type='submit'
                            >
                                Autenticar
                            </ChakraButton>
                        </AlertDialogCancel>
                    </form>
                </AlertDialogDescription>
                <AlertDialogAction className='hidden' ref={closeButtonRef} />
            </AlertDialogContent>
        </AlertDialog>
    );
}