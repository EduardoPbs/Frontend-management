import { useOrder } from '../../hooks/useOrder';
import { RowDetail } from '../../components/RowDetail';
import { LgSpinner } from '../../components/LgSpinner';
import { CellDetail } from '../../components/CellDetail';
import { IconButton } from '../../components/IconButton';
import { PageContainer } from '../../components/PageContainer';
import { toFullLocaleDate } from '../../utils/toFullLocaleDate';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ItemEntity, OrderEntity } from '../../types/order';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { Box, Card, Tooltip, CardBody, CardHeader } from '@chakra-ui/react';
import {
    primary_red,
    primary_white,
    primary_hover_red,
} from '../../constants/styles';

export function OrderDetail() {
    const [orderData, setOrderData] = useState<OrderEntity>();
    const { getOrderById, isLoadingUnique } = useOrder();
    const { id } = useParams();
    const navigate = useNavigate();

    const rowStyle = 'flex-row items-center w-fit gap-2';

    useEffect(() => {
        if (id !== undefined) {
            getOrderById(id, setOrderData);
        }
    }, []);

    if (isLoadingUnique) return <LgSpinner />;

    return (
        <PageContainer title={`Venda - ${id?.slice(0, 8)}`}>
            <IconButton
                to={-1}
                label='Voltar'
                className='w-fit'
                icon={ArrowLeftCircle}
                bgColor={primary_red}
                textColor={primary_white}
                bgHoverColor={primary_hover_red}
            />

            <Box className='flex border-4 border-border-gray rounded-round-default'>
                <Card className='w-full h-[500px]'>
                    <CardHeader className='flex flex-col justify-center text-2xl font-semibold text-primary-black'>
                        <Box className='flex items-center justify-between w-full bg-zinc-100/15 rounded-round-default p-1'>
                            <CellDetail
                                name='Data'
                                content={
                                    orderData?.date
                                        ? toFullLocaleDate(orderData.date)
                                        : '--'
                                }
                                className={rowStyle}
                                style='text-3xl text-primary-black'
                            />
                            <CellDetail
                                name='Qtde. itens'
                                content={orderData?.items?.length || ''}
                                className={rowStyle}
                                style='text-3xl text-primary-black'
                            />
                            <CellDetail
                                name='Total'
                                content={
                                    Number(orderData?.total).toLocaleString(
                                        'pt-br',
                                        { style: 'currency', currency: 'BRL' }
                                    ) || ''
                                }
                                className={rowStyle}
                                style='text-3xl'
                            />
                        </Box>

                        <Box className='flex items-center justify-between w-full bg-zinc-100/15 rounded-round-default p-1'>
                            <CellDetail
                                name='Vendido por'
                                content={orderData?.employee.name || ''}
                                className={rowStyle}
                                style='text-2xl'
                            />
                            <CellDetail
                                name='Cód. Vendedor'
                                content={
                                    orderData?.employee.id
                                        .slice(0, 8)
                                        .toUpperCase() || ''
                                }
                                className={rowStyle}
                                style='text-2xl'
                            />
                        </Box>
                    </CardHeader>

                    <CardBody className='flex flex-col gap-2 m-2 text-white bg-primary-white/15 rounded-md border-2 border-border-gray overflow-hidden overflow-y-scroll scrollbar-hide'>
                        <Box className='flex flex-col gap-2'>
                            {orderData?.items.map(
                                (item: ItemEntity, index: number) => {
                                    return (
                                        <RowDetail key={index}>
                                            <CellDetail
                                                name='Produto'
                                                content={item.product.name}
                                            />
                                            <CellDetail
                                                name='Valor/unidade'
                                                content={Number(
                                                    item.product.value
                                                ).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            />
                                            <CellDetail
                                                name='Quantidade'
                                                content={item.quantity}
                                            />
                                            <CellDetail
                                                name='Total'
                                                content={Number(
                                                    item.quantity *
                                                        item.product.value
                                                ).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            />
                                            <Tooltip label='Detalhes do produto'>
                                                <ArrowRightCircle
                                                    className='size-8 hover:cursor-pointer hover:text-custom-red duration-150'
                                                    onClick={() =>
                                                        navigate(
                                                            `/products/${item.product.id}`
                                                        )
                                                    }
                                                />
                                            </Tooltip>
                                        </RowDetail>
                                    );
                                }
                            )}
                        </Box>
                    </CardBody>
                </Card>
            </Box>
        </PageContainer>
    );
}
