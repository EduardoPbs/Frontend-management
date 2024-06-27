import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LgInput } from "@/components/LgInput";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useProduct } from "@/hooks/useProduct";
import { IconButton } from "@/components/IconButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePromotion } from "@/hooks/usePromotion";
import { ProductEntity } from "@/types/product";
import { PageContainer } from "@/components/PageContainer";
import { addDays, format } from "date-fns";
import { ArrowLeftCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PromotionForm() {
    const [selectedProduct] = useState<string>();
    const [date, setDate] = useState<DateRange | undefined>({ from: new Date(), to: addDays(new Date(), 2) });
    const { allProducts } = useProduct();
    const { PromotionFormSchema, onSubmit } = usePromotion();
    const {
        control,
        formState: { errors },
        handleSubmit
    } = useForm({
        resolver: zodResolver(PromotionFormSchema),
        defaultValues: {
            product: selectedProduct || '',
            date: { from: new Date, to: addDays(new Date(), 2) },
            discount: '1'
        },
    });

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
                        <Controller
                            name="product"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        onValueChange={val => field.onChange(val)}
                                        value={selectedProduct}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione um produto" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Produtos</SelectLabel>
                                                {allProducts.products.map((product: ProductEntity, index: number) => (
                                                    <SelectItem key={index} value={product.id}>
                                                        {product.nome}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.product && (
                                        <p className='text-red-500'>{String(errors.product.message)}</p>
                                    )}
                                </>

                            )}
                        />
                    </div>

                    <div className='flex flex-col justify-center'>
                        <p className='font-semibold'>Período:</p>
                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => {
                                return (
                                    <>
                                        <DatePickerWithRange
                                            {...field}
                                            date={date}
                                            setDate={setDate}
                                            className="flex-1"
                                        />
                                        {errors.date && (
                                            <p className='text-red-500'>{String(errors.date.message)}</p>
                                        )}
                                    </>
                                );
                            }}
                        />
                    </div>

                    <div className='flex flex-col justify-center flex-1'>
                        <p className='font-semibold truncate'>Desconto em porcentagem (%):</p>
                        <LgInput
                            name="discount"
                            control={control}
                            errors={errors.discount}
                            type="number"
                            autoComplete="disabled"
                            placeholder="5"
                        />
                    </div>
                </form>
                <Button
                    type="submit"
                    className='min-w-fit w-[250px] self-end hover:bg-primary-hover-red'
                    onClick={handleSubmit(onSubmit)}
                >
                    Registrar
                </Button>
            </div>
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
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
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