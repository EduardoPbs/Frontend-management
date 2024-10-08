import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useProduct } from "@/hooks/useProduct";
import { IconButton } from "@/components/IconButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePromotion } from "@/hooks/usePromotion";
import { ProductEntity } from "@/types/product";
import { PageContainer } from "@/components/PageContainer";
import { ArrowLeftCircle } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@chakra-ui/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PromotionForm() {
    const [selectedProduct, setSelectedProduct] = useState<string>();
    const [discountValue, setDiscountValue] = useState<string | number>(1);
    const [date, setDate] = useState<DateRange | undefined>();
    const { allProducts } = useProduct();
    const { PromotionFormSchema, onSubmit } = usePromotion();
    const {
        formState: { errors },
    } = useForm({
        resolver: zodResolver(PromotionFormSchema),
        defaultValues: {
            product: selectedProduct || '',
            date: { from: date?.from, to: date?.to },
            discount: '1'
        },
    });

    const toast = useToast();

    return (
        <PageContainer title="Criar">
            <IconButton
                to={-1}
                label='Voltar'
                className='w-fit'
                icon={ArrowLeftCircle}
            />
            <div className='flex flex-col justify-center gap-4'>
                <form className='flex items-center justify-between flex-wrap gap-2'>
                    <div className='flex flex-col justify-center flex-1'>
                        <p className='font-semibold'>Produto:</p>
                        <>
                            <Select
                                value={selectedProduct}
                                onValueChange={e => setSelectedProduct(e)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um produto" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Produtos</SelectLabel>
                                        {allProducts.products.map((product: ProductEntity, index: number) => {
                                            if (product.estoque > 5)
                                                return (
                                                    <SelectItem key={index} value={product.id}>
                                                        {product.nome}
                                                    </SelectItem>
                                                );
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.product && (
                                <p className='text-red-500'>{String(errors.product.message)}</p>
                            )}
                        </>
                    </div>

                    <div className='flex flex-col justify-center'>
                        <p className='font-semibold'>Período:</p>
                        <>
                            <DatePickerWithRange
                                date={date}
                                setDate={setDate}
                                className="flex-1"
                            />
                            {errors.date && (
                                <p className='text-red-500'>{String(errors.date.message)}</p>
                            )}
                        </>
                    </div>

                    <div className='flex flex-col justify-center flex-1'>
                        <p className='font-semibold truncate'>Desconto em porcentagem (%):</p>
                        <Input
                            value={discountValue}
                            onChange={e => setDiscountValue(e.target.value)}
                        />
                    </div>
                </form>
                <Button
                    type="submit"
                    className='min-w-fit w-[250px] self-end hover:bg-primary-hover-red'
                    onClick={() => {
                        if (!selectedProduct) {
                            toast({
                                title: 'Falha ao cadastrar promoção.',
                                description: 'Um produto precisa ser selecionado!',
                                position: 'top-right',
                                status: 'error',
                                isClosable: true,
                            });

                            return;
                        }

                        if (Number(discountValue) <= 0 || Number(discountValue) > 95) {
                            toast({
                                title: 'Falha ao cadastrar promoção.',
                                description: 'Valor de desconto inválido!',
                                position: 'top-right',
                                status: 'error',
                                isClosable: true,
                            });

                            return;
                        }

                        onSubmit(selectedProduct, discountValue, date);
                    }}
                >
                    Registrar
                </Button>
            </div>

            <Card className='w-fit'>
                <CardHeader>
                    Info
                </CardHeader>
                <CardContent>
                    <span className='font-semibold text-sm'>
                        &bull; Promoções com data <span className='font-bold text-red-600'>NÃO ESCOLHIDA</span> serão iniciadas imediatamente, com duração de dois(2) dias e oito(8) <br />
                        &nbsp; horas a partir da hora de criação da promoção, podendo ser desativadas a qualquer momento.
                        <span className="font-bold opacity-80">
                            {" "}Ex.: <br />
                            &nbsp; &nbsp; Criação em: 16/07/2024 - 11:00. <br />
                            &nbsp; &nbsp; Finalizar em: 18/07/2024 - 19:00.
                        </span>
                    </span>
                    <br />
                    <span className='font-semibold text-sm'>
                        &bull; Promoções com datas vencidas serão excluídas automaticamente após a próxima verificação do sistema.
                    </span>
                    <br />
                    <span className='font-semibold text-sm'>
                        &bull; Produtos com estoque abaixo de <span className='text-lg font-bold'>5</span> não serão listados para promoções.
                    </span>
                    <br />
                    <span className='font-semibold text-sm'>
                        &bull; Desconto em porcentagem deve estar entre <span className='text-lg font-bold'>1</span> e <span className='text-lg font-bold'>95</span>.
                    </span>
                    <br />
                    <span className='font-semibold text-sm'>
                        &bull; Promoções criadas com início e término no mesmo dia, terão duração padrão de <span className='text-lg font-bold'>11</span> horas.
                    </span>
                </CardContent>
            </Card>
        </PageContainer>
    );
}

function DatePickerWithRange({ className, date, setDate }: { className?: string; date: any; setDate: any; }) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL, dd")} -{" "}
                                    {format(date.to, "LLL, dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
