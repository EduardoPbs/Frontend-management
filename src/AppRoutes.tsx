import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import {
    Home,
    Login,
    Orders,
    Products,
    Purchases,
    OrderForm,
    Employees,
    ProductForm,
    OrderDetail,
    PurchaseForm,
    CashRegister,
    EmployeeForm,
    EmployeeDetail,
    PurchaseDetail,
} from './Pages';

function AppRoutes() {
    return (
        <ChakraProvider>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />

                    <Route path='/products' element={<Products />} />
                    <Route path='/products/new' element={<ProductForm />} />
                    <Route path='/products/edit/:id' element={<ProductForm />} />

                    <Route path='/orders' element={<Orders />} />
                    <Route path='/orders/new/:id' element={<OrderForm />} />
                    <Route path='/orders/:id' element={<OrderDetail />} />

                    <Route path='/employees' element={<Employees />} />
                    <Route path='/employees/new' element={<EmployeeForm />} />
                    <Route path='/employees/edit/:id' element={<EmployeeForm />} />
                    <Route path='/employees/:id' element={<EmployeeDetail />} />

                    <Route path='/purchases' element={<Purchases />} />
                    <Route path='/purchases/new/:id' element={<PurchaseForm />} />
                    <Route path='/purchases/:id' element={<PurchaseDetail />} />

                    <Route path='/cash-register' element={<CashRegister />} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default AppRoutes;
