import { Title } from '../../components/Title';
import { CustomTh } from '../../components/CustomTh';
import { useOrder } from '../../hooks/useOrder';
import { LgSpinner } from '../../components/LgSpinner';
import { PlusCircle } from 'lucide-react';
import { IconButton } from '../../components/IconButton';
import { useNavigate } from 'react-router';
import { useEmployee } from '../../hooks/useEmployee';
import { OrderEntity } from '../../types/order';
import { PageContainer } from '../../components/PageContainer';
import { EmployeeEntity } from '../../types/employee';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import {
    custom_red,
    primary_red,
    round_default,
    primary_white,
    table_row_hover,
    primary_hover_red,
} from '../../constants/styles';
import {
    Td,
    Tr,
    Box,
    Tbody,
    Modal,
    Table,
    Thead,
    Button,
    Select,
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
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');

    const { dataOrders, isLoading, createOrder } = useOrder();
    const { dataEmployees } = useEmployee();

    const navigate = useNavigate();
    const initialRef = useRef(null);
    const finalRef = useRef(null);
    const { control } = useForm();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        document.title = 'Management | Vendas';
    }, []);

    if (isLoading) return <LgSpinner />;

    return (
        <PageContainer title='Vendas'>
            <Box className='flex items-center'>
                <IconButton
                    label='Nova venda'
                    className='w-fit'
                    onClick={onOpen}
                    icon={PlusCircle}
                    bgColor={primary_red}
                    textColor={primary_white}
                    bgHoverColor={primary_hover_red}
                />
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
                                            focusBorderColor={custom_red}
                                            placeholder='Selecione um funcionário'
                                            onChange={(e) =>
                                                setSelectedEmployee(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            {dataEmployees &&
                                                dataEmployees?.map(
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
                                borderRadius={round_default}
                                backgroundColor={primary_red}
                                color={primary_white}
                                _hover={{
                                    bg: primary_hover_red,
                                    color: primary_white,
                                }}
                                onClick={() => {
                                    if (!selectedEmployee)
                                        alert('Escolha um funcionário.');

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
                <Title variant='h3'>Resumo - Vendas</Title>

                <Title variant='h3'>
                    Cadastrados:{' '}
                    <span className='text-4xl text-primary-red'>
                        {dataOrders.total}
                    </span>
                </Title>
            </div>

            <Box className='overflow-y-scroll scrollbar-hide border-2 border-border-gray rounded-round-default'>
                <TableContainer>
                    <Table size='sm'>
                        <Thead className='text-white text-xl select-none'>
                            <Tr>
                                <CustomTh>Cód. Pedido</CustomTh>
                                <CustomTh>Qtde. itens</CustomTh>
                                <CustomTh>Data</CustomTh>
                                <CustomTh>Total</CustomTh>
                                <CustomTh outStyle='border-r-0'>Ações</CustomTh>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {dataOrders.orders &&
                                dataOrders.orders.map((order: OrderEntity) => {
                                    return (
                                        <Tr
                                            key={order.id}
                                            className={table_row_hover}
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
                                                    borderRadius={round_default}
                                                    backgroundColor={
                                                        primary_red
                                                    }
                                                    color={primary_white}
                                                    _hover={{
                                                        bg: primary_hover_red,
                                                    }}
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
