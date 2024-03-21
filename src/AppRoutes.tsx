import { Home } from './Pages/Home';
import { Login } from './Pages/Login';
import { Orders } from './Pages/Orders';
import { Products } from './Pages/Products';
import { Purchases } from './Pages/Purchases';
import { Employees } from './Pages/Employees';
import { OrderForm } from './Pages/Orders/OrderForm';
import { ProductForm } from './Pages/Products/ProductForm';
import { OrderDetail } from './Pages/Orders/OrderDetail';
import { PurchaseForm } from './Pages/Purchases/PurchaseForm';
import { EmployeeForm } from './Pages/Employees/EmployeeForm';
import { ChakraProvider } from '@chakra-ui/react';
import { EmployeeDetail } from './Pages/Employees/EmployeeDetail';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { PurchaseDetail } from './Pages/Purchases/PurchaseDetail';

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
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default AppRoutes;
