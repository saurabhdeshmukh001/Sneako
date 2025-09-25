// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProduct from "./Pages/AddProduct";
import UpdateProduct from "./components/UpdateProduct";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import Admin from "./Pages/admin";
import Cart from "./Pages/Cart";
import ProfileManage from "./Pages/ProfileManage";
import ProductManagement from "./Pages/ProductManagement";
import UserProfileManagement from "./Pages/UserProfileManagement";
import ProductDetails from "./Pages/ProductDetails";
import CheckoutPage from "./Pages/CheckoutPage";
import OrderConfirmation from "./Pages/OrderConfirmation";
import OrderTracking from "./Pages/OrderTracking"
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileManage /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
        <Route path="/order-tracking/:orderId" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />

        <Route 
          path="/admin" 
          element={<ProtectedRoute allowedRoles={['seller']}><Admin /></ProtectedRoute>} 
        />
        <Route 
          path="/add-product" 
          element={<ProtectedRoute allowedRoles={['seller']}><AddProduct /></ProtectedRoute>} 
        />
        <Route 
          path="/manage-products" 
          element={<ProtectedRoute allowedRoles={['seller']}><ProductManagement /></ProtectedRoute>} 
        />
        <Route 
          path="/edit-product/:id" 
          element={<ProtectedRoute allowedRoles={['seller']}><UpdateProduct /></ProtectedRoute>} 
        />
        <Route 
          path="/manage-users" 
          element={<ProtectedRoute allowedRoles={['seller']}><UserProfileManagement /></ProtectedRoute>} 
        />

      </Routes>
    </Router>
  );
}

export default App;