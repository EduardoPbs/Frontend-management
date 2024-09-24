import { Button } from "@/components/ui/button";
import { UserPopover } from '@/components/UserPopover';
import { useNavigate } from 'react-router';
import { Menu, Package2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
    title?: string;
}

export function Header({ title }: HeaderProps) {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background py-6 px-4 md:px-6 bg-primary-black">
            <nav className="hidden select-none flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 font">
                <div className='flex items-center uppercase gap-2 font-bold w-[225px]'>
                    <Package2 className="size-8" />
                    <h2>{title}</h2>
                </div>
                <a onClick={() => navigate("/")} className="text-primary-white hover:text-warning-red transition-colors cursor-pointer">
                    Início
                </a>
                {/* <a onClick={() => navigate("/products")} className="text-primary-white hover:text-warning-red transition-colors cursor-pointer">
                    Produtos
                </a> */}
                {/* <a onClick={() => navigate("/purchases")} className="text-primary-white hover:text-warning-red transition-colors cursor-pointer">
                    Compras
                </a> */}
                <a onClick={() => navigate("/stock")} className="text-primary-white hover:text-warning-red transition-colors cursor-pointer">
                    Estoque
                </a>
                <a onClick={() => navigate("/orders")} className="text-primary-white hover:text-warning-red transition-colors cursor-pointer">
                    Vendas
                </a>
                <a onClick={() => navigate("/employees")} className="text-primary-white hover:text-warning-red transition-colors cursor-pointer">
                    Funcionários
                </a>
                <a onClick={() => navigate("/cash-register")} className="text-primary-white hover:text-warning-red transition-colors cursor-pointer">
                    Caixa
                </a>
                <a onClick={() => navigate("/promotions")} className="text-primary-white hover:text-warning-red transition-colors cursor-pointer">
                    Promoções
                </a>
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5 text-primary-black" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <div className='flex items-center uppercase gap-2 font-bold w-[225px]'>
                            <Package2 className="size-8" />
                            <h2>{title}</h2>
                        </div>
                        <a onClick={() => navigate("/")} className="text-primary-black hover:text-warning-red transition-colors cursor-pointer">
                            Início
                        </a>
                        {/* <a onClick={() => navigate("/products")} className="text-primary-black hover:text-warning-red transition-colors cursor-pointer">
                            Produtos
                        </a> */}
                        {/* <a onClick={() => navigate("/purchases")} className="text-primary-black hover:text-warning-red transition-colors cursor-pointer">
                            Compras
                        </a> */}
                        <a onClick={() => navigate("/stock")} className="text-primary-black hover:text-warning-red transition-colors cursor-pointer">
                            Estoque
                        </a>
                        <a onClick={() => navigate("/orders")} className="text-primary-black hover:text-warning-red transition-colors cursor-pointer">
                            Vendas
                        </a>
                        <a onClick={() => navigate("/employees")} className="text-primary-black hover:text-warning-red transition-colors cursor-pointer">
                            Funcionários
                        </a>
                        <a onClick={() => navigate("/cash-register")} className="text-primary-black hover:text-warning-red transition-colors cursor-pointer">
                            Caixa
                        </a>
                        <a onClick={() => navigate("/promotions")} className="text-primary-black hover:text-warning-red transition-colors cursor-pointer">
                            Promoções
                        </a>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <UserPopover />
            </div>
        </header>
    );
}
