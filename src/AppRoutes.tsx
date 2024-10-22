import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import {
    Home,
    Login,
    Stock,
    Orders,
    Products,
    Settings,
    // Purchases,
    Movements,
    StockForm,
    OrderForm,
    Employees,
    Promotions,
    OrderDetail,
    CashHistory,
    ProductForm,
    // PurchaseForm,
    CashRegister,
    EmployeeForm,
    PromotionForm,
    EmployeeDetail,
    // PurchaseDetail,
    PromotionDetail,
} from './Pages';

function AppRoutes() {
    return (
        <ChakraProvider>
            <BrowserRouter>
                <Routes>
                    <Route path='*' element={<Navigate to='/login' replace={true} />} />
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />

                    <Route path='/products' element={<Products />} />
                    <Route path='/products/new' element={<ProductForm />} />
                    <Route path='/products/edit/:id' element={<ProductForm />} />

                    <Route path='/orders' element={<Orders />} />
                    <Route path='/orders/new' element={<OrderForm />} />
                    <Route path='/orders/:id' element={<OrderDetail />} />

                    <Route path='/employees' element={<Employees />} />
                    <Route path='/employees/new' element={<EmployeeForm />} />
                    <Route path='/employees/edit/:id' element={<EmployeeForm />} />
                    <Route path='/employees/:id' element={<EmployeeDetail />} />

                    {/* <Route path='/purchases' element={<Purchases />} />
                    <Route path='/purchases/new' element={<PurchaseForm />} />
                    <Route path='/purchases/:id' element={<PurchaseDetail />} /> */}
                    <Route path='/stock' element={<Stock />} />
                    <Route path='/stock/entrance' element={<StockForm />} />
                    <Route path='/stock/output' element={<StockForm />} />
                    <Route path='/stock/:id' element={<OrderDetail />} />

                    <Route path='/cash-register' element={<CashRegister />} />
                    <Route path='/cash-register/history' element={<CashHistory />} />

                    <Route path='/promotions' element={<Promotions />} />
                    <Route path='/promotions/new' element={<PromotionForm />} />
                    <Route path='/promotions/:id' element={<PromotionDetail />} />

                    <Route path='/cash-register/movements' element={<Movements />} />

                    <Route path='/settings' element={<Settings />}/>
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default AppRoutes;
