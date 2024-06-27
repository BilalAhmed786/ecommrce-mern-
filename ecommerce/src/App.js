import './App.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Headers from './pages/Header';
import Footer from './pages/Footer';
import Footerbottom from './pages/Footerbottom';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkoutstripe from './pages/Checkoutstripe';
import Product from './pages/Product';
import Pagenotfound from './pages/Pagenotfound';
// auth pages import
import Registeration from './auth/Registeration';
import Login from './auth/Login';
import Forgetpassword from './auth/Forgetpassword';
import Passwordreset from './auth/Passwordreset';
import Dashboard from './admin/Dashboard';
import Welcome from './users/Welcome';
import Billingaddress from './users/Billingaddress';
import Profile from './users/Profile';
// protected routes
import Protected from './protected/AdminProtected';//for Admin protection
import ClientProtected from './protected/ClientProtected';//for subscribers protection
import Addproduct from './admin/Addproduct';
import Addcategory from './admin/Addcategory';
import Currency from './admin/Currency';
import Shipment from './admin/Shipment';
import Allusers from './admin/Allusers';
import Allproducts from './admin/Allproducts';
import Editproduct from './admin/Editproduct';
import Productreviews from './admin/Productreviews';
import Orders from './admin/Orders';
import Orderview from './admin/Orderview';
import Changepassword from './admin/Changepassword';
import Clientorders from './users/Clientorders';
import Clientordersview from './users/Clientordersview';
import Testcomponent from './admin/Testcomponent';






function App() {
  return (
    <div className="App">

      <BrowserRouter>
       <Headers />
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkoutstripe />} />
          <Route path="/product/:id" element={<Product />} />
          {/* auth routes */}
          <Route path="/register" element={<Registeration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Forget-password" element={<Forgetpassword />} />
          <Route path="/reset-password/:token" element={<Passwordreset />} />
          {/* protected routes */}
          <Route path="/dashboard" element={<Protected Component={Dashboard} />} />
          <Route path="/addproduct" element={<Protected Component={Addproduct} />} />
          <Route path="/orders" element={<Protected Component={Orders} />} />
          <Route path="/orders/:id" element={<Orderview/>}/>
          <Route path="/addcategory" element={<Protected Component={Addcategory} />} />
          <Route path="/addcurrency" element={<Protected Component={Currency} />} />
          <Route path="/shipment" element={<Protected Component={Shipment} />} />
          <Route path="/alluser" element={<Protected Component={Allusers} />} />
          <Route path="/productreviews" element={<Protected Component={Productreviews} />} />
          <Route path="/allproducts" element={<Protected Component={Allproducts} />} />
          <Route path="/allproducts/:id" element={<Editproduct />} />
          <Route path="/testcomponent/" element={<Protected Component={Testcomponent} />} />
          <Route path="/changepass" element={<Protected Component={Changepassword} />} />
          <Route path="/client" element={< ClientProtected Component={Welcome} />} />
          <Route path="/Profile" element={< ClientProtected Component={Profile} />} />
          <Route path="/billingaddress" element={< ClientProtected Component={Billingaddress} />} />
          <Route path="/clientorders" element={< ClientProtected Component={Clientorders} />} />
          <Route path="/clientorders/:id" element={< ClientProtected Component={Clientordersview} />} />
          

          <Route path="/*" element={<Pagenotfound />} />

        </Routes>

        <Footer />
        <Footerbottom/>
      </BrowserRouter>

    </div>
  );
}

export default App;
