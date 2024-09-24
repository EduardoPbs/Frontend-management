import { Content } from "@/components/Content";
import { IconButton } from "@/components/IconButton";
import { PageContainer } from "@/components/PageContainer";
import { Title } from "@/components/Title";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProduct } from "@/hooks/useProduct";
import { ProductEntity } from "@/types";
import { AlertCircle, ArrowRightCircle, Package, PackageMinus, PackagePlus } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function Stock() {
    const { allProducts } = useProduct();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Management | Estoque';
    }, []);

    return (
        <PageContainer title='Estoque'>
            <div className='flex items-center gap-2'>
                <IconButton
                    to={'entrance'}
                    label='Registrar Entrada'
                    className='w-fit py-4'
                    icon={PackagePlus}
                />
                <IconButton
                    to={'/products'}
                    label='Produtos'
                    className='w-fit py-4'
                    icon={Package}
                />

                <IconButton
                    to={'output'}
                    label='Registrar Saída'
                    className='w-fit py-4'
                    icon={PackageMinus}
                />
            </div>
            <Content className='w-full border-border-gray h-full'>
                <Title variant='h3'>
                    Produtos com baixo estoque: {' '}
                    <span className='text-2xl text-primary-red'>{allProducts?.products
                        .filter((p: ProductEntity) => p.estoque <= 10).length}</span>
                </Title>

                <ScrollArea className=' max-h-[450px]'>
                    <div className='flex flex-col gap-2 overflow-hidden rounded-round-default'>
                        {allProducts.products && allProducts?.products
                            .filter((p: ProductEntity) => p.estoque <= 10)
                            .map((prod: ProductEntity, index: number) => (
                                <p
                                    key={index}
                                    className='flex items-center justify-between gap-4 border-2 border-gray-400/60 rounded-round-default px-4 py-2 font-semibold hover:border-primary-hover-red hover:bg-primary-white/50 hover:cursor-default hover:shadow-md duration-150'
                                >
                                    <span className='flex items-center gap-2'>
                                        <AlertCircle className='text-warning-red' />
                                        <span className='w-[200px]'>{prod.nome}</span>
                                    </span>
                                    <span>
                                        Estoque:{' '}
                                        <span
                                            className={
                                                prod.estoque > 5
                                                    ? 'text-custom-red'
                                                    : 'text-primary-hover-red'
                                            }
                                        >
                                            {prod.estoque}
                                        </span>
                                    </span>
                                    <span>
                                        Status:{' '}
                                        <span
                                            className={prod.ativo
                                                ? 'text-agreed-green'
                                                : 'text-primary-hover-red'
                                            }
                                        >
                                            {prod.ativo ? 'Online' : 'Offline'}
                                        </span>
                                    </span>

                                    <ArrowRightCircle
                                        className='hover:cursor-pointer'
                                        onClick={() => { navigate('/products'); }}
                                    />
                                </p>
                            ))}
                    </div>
                </ScrollArea>
            </Content>
        </PageContainer>
    );
}