import { Home } from './Pages/Home';
import { Products } from './Pages/Products';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ProductForm } from './Pages/Products/ProductForm';
import { Login } from './Pages/Login';
import { Orders } from './Pages/Orders';
import { OrderDetail } from './Pages/Orders/OrderDetail';
import { Employees } from './Pages/Employees';

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
                    <Route path='/orders/:id' element={<OrderDetail />} />

                    <Route path='/employees' element={<Employees />} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default AppRoutes;
