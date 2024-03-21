import { http } from '../../service';
import { Title } from '../../components/Title';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { OrderEntity } from '../../constants/order';
import { PageContainer } from '../../components/PageContainer';
import { EmployeeEntity } from '../../constants/employee';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import {
    Td,
    Th,
    Tr,
    Box,
    Tbody,
    Modal,
    Table,
    Thead,
    Button,
    Select,
    Spinner,
    ModalBody,
    FormLabel,
    ModalHeader,
    ModalFooter,
    FormControl,
    ModalContent,
    ModalOverlay,
    useDisclosure,
    TableContainer,
    ModalCloseButton,
} from '@chakra-ui/react';

export function Orders() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [employees, setEmployees] = useState<EmployeeEntity[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [dataOrders, setDataOrders] = useState<{
        orders: OrderEntity[];
        total: number;
    }>({
        orders: [],
        total: 0,
    });

    const navigate = useNavigate();
    const initialRef = useRef(null);
    const finalRef = useRef(null);
    const { control } = useForm();
    const { isOpen, onOpen, onClose } = useDisclosure();

    async function createOrder(id: string) {
        if (!selectedEmployee) alert('Escolha um funcionário.');

        try {
            const response = await http.post('/orders', {
                employee_id: id,
            });
            navigate(`new/${response.data}`);
        } catch (error) {
            console.error(error);
        }
    }

    async function getDataOrders() {
        try {
            const response = await http.get('/orders');
            setDataOrders({
                orders: response.data,
                total: response.data.length,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function getEmployees() {
        try {
            const response = await http.get('/employees/all');
            setEmployees(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        document.title = 'Management | Vendas'
        getDataOrders();
        getEmployees();
    }, []);

    if (isLoading)
        return (
            <PageContainer>
                <div className='flex justify-center'>
                    <Spinner size='xl' color='yellow.500' />
                </div>
            </PageContainer>
        );

    return (
        <PageContainer title='Vendas'>
            <Box className='flex items-center'>
                <Button
                    className='flex items-center gap-2'
                    onClick={onOpen}
                    colorScheme='yellow'
                >
                    <PlusCircle />
                    Nova venda
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
                        <ModalHeader>Quem está vendendo?</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <Controller
                                name='employee_id'
                                control={control}
                                render={({ field }) => (
                                    <FormControl>
                                        <FormLabel>Funcionário:</FormLabel>
                                        <Select
                                            {...field}
                                            id='employee_id'
                                            focusBorderColor='yellow.500'
                                            placeholder='Selecione um funcionário'
                                            onChange={(e) =>
                                                setSelectedEmployee(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            {employees &&
                                                employees?.map(
                                                    (
                                                        employee: EmployeeEntity,
                                                        index: number
                                                    ) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={
                                                                    employee?.id
                                                                }
                                                            >
                                                                {employee?.name}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </ModalBody>

                        <ModalFooter className='flex items-center gap-2'>
                            <Button colorScheme='gray' onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button
                                colorScheme='yellow'
                                onClick={() => {
                                    createOrder(selectedEmployee);
                                }}
                            >
                                Cadastrar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>

            <div className='flex items-center justify-between'>
                <Title variant='h3'>Resumo - Pedidos</Title>

                <Title variant='h3'>
                    Cadastrados:{' '}
                    <span className='text-4xl text-amber-400'>
                        {dataOrders.total}
                    </span>
                </Title>
            </div>

            <Box className='overflow-y-scroll scrollbar-hide border-2 rounded-md'>
                <TableContainer>
                    <Table size='sm'>
                        <Thead className='text-white text-xl select-none'>
                            <Tr>
                                <Th>Cód. Pedido</Th>
                                <Th>Qtde. itens</Th>
                                <Th>Data</Th>
                                <Th>Total</Th>
                                <Th>Ações</Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {dataOrders.orders &&
                                dataOrders.orders.map((order: OrderEntity) => {
                                    return (
                                        <Tr
                                            key={order.id}
                                            className='font-semibold hover:bg-zinc-100/30 duration-150'
                                        >
                                            <Td>{order.id.slice(0, 8)}</Td>
                                            <Td>{order.items.length}</Td>
                                            <Td>
                                                {toFullLocaleDate(order.date)}
                                            </Td>
                                            <Td>
                                                {Number(
                                                    order.total
                                                ).toLocaleString('pt-br', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            </Td>
                                            <Td>
                                                <Button
                                                    className='w-full'
                                                    height={8}
                                                    colorScheme='yellow'
                                                    onClick={() =>
                                                        navigate(`${order.id}`)
                                                    }
                                                >
                                                    Ver detalhes
                                                </Button>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </PageContainer>
    );
}
