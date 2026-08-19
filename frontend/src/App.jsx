import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import CategoryList from "./pages/CategoryList";
import BrandList from "./pages/BrandList";
import Home from "./pages/Home.jsx"

import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Footer from "./components/Footer.jsx";
import TopBar from "./components/TopBar.jsx";
import Pagination from "./components/Pagination";

import Cart from "./pages/Card";
import Orders from "./pages/Orders";
import WishList from "./pages/WishList";
import Review from "./pages/Review";
import PrescriptionUpload from "./pages/PrescriptionUpload.jsx";
import PetProfile from "./pages/PetProfile.jsx";
import RecommendedProducts from "./pages/RecommendedProducts";
import ForgotPassword from "./components/ForgotPassword.jsx";
import Offers from "./pages/Offers";

// ================= ADMIN =================
import ManageProducts from "./admin/ManageProducts";
import AddProduct from "./admin/AddProduct";
import CustomerList from "./admin/CustomerList.jsx";
import OrderList from "./admin/OrderList";
import EditProduct from "./admin/EditProduct";
import CouponList from "./admin/CouponList";
import AddCoupon from "./admin/AddCoupon";


// Later
// import ManageCategories from "./admin/categories/ManageCategories";
// import AddCategory from "./admin/categories/AddCategory";
// import EditCategory from "./admin/categories/EditCategory";

// import ManageBrands from "./admin/brands/ManageBrands";
// import AddBrand from "./admin/brands/AddBrand";
// import EditBrand from "./admin/brands/EditBrand";

import "./App.css";
import Payment from "./pages/Payment.jsx";

function AppContent() {

  const [showSidebar, setShowSidebar] = useState(true);

  const location = useLocation();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("access");

  const isLoggedIn = !!token;

  const isAdminOrStaff =
    role === "Admin" || role === "Staff";

  const isCustomer = role === "Customer";


  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register"||
    location.pathname ==="/forgotpassword"

  return (
    <>

      {!hideLayout && (
        <Navbar
          toggleSidebar={() => setShowSidebar(!showSidebar)}
        />
      )}

      <div className="app-layout">

      {!hideLayout && isLoggedIn && !isCustomer && showSidebar && (
        <Sidebar />
      )}

        <main className={hideLayout ? "auth-content" : "main-content"}>

          <Routes>

            <Route
              path="/"
              element={<Navigate to="/home" replace />}
            />

            {/* ================= PUBLIC ================= */}

            <Route
              path="/home"

              element={<Home />}
            />
             <Route
              path="/Products"

              element={<ProductList />}
            />

            <Route
              path="/products/:id"
              element={<ProductDetails />}
            />

            <Route
              path="/categories"
              element={<CategoryList />}
            />

            <Route
              path="/brands"
              element={<BrandList />}
            />
            <Route path="/offers" element={<Offers />} />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/wishlists"
              element={<WishList />}
            />

            <Route
              path="/products/:id/reviews"
              element={<Review />}
            />
            <Route
                path="pets"
                element={<PetProfile/>}
            />
             <Route
                path="/recommended-products/:petId"
                element={<RecommendedProducts />}
            />
            <Route
              path="/profile"
              element={<Profile />}
            />
            <Route
              path="/prescription/upload"
              element={<PrescriptionUpload />}
          />
            <Route
                path="/payment"
                element={<Payment />}
            />

            {/* ================= AUTH ================= */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />
            <Route
            path="/forgotpassword"
            element={<ForgotPassword/>}
            />

             <Route
              path="/customers"
              element={<CustomerList />}
            />

            {/* ================= PRODUCT ADMIN ================= */}

            <Route
              path="/products/manage"
              element={
                isAdminOrStaff
                  ? <ManageProducts />
                  : <Navigate to="/products" replace />
              }
            />

            <Route
              path="/products/add"
              element={
                isAdminOrStaff
                  ? <AddProduct />
                  : <Navigate to="/products" replace />
              }
            />
            <Route
              path="total-orders"
              element={
                  role === "Admin" || role === "Staff"
                      ? <OrderList />
                      : <Navigate to="/products" replace />
              }
          />

            <Route
              path="/products/edit/:id"
              element={
                isAdminOrStaff
                  ? <EditProduct />
                  : <Navigate to="/products" replace />
              }
            />

            <Route
                path="/admin/coupons"
                element={
                    isAdminOrStaff
                        ? <CouponList />
                        : <Navigate to="/products" replace />
                }
            />

            <Route
                path="/admin/coupons/add"
                element={
                    isAdminOrStaff
                        ? <AddCoupon />
                        : <Navigate to="/products" replace />
                }
            />

            {/* ================= CATEGORY ADMIN ================= */}

            {/*
            <Route
              path="/categories/manage"
              element={
                isAdminOrStaff
                  ? <ManageCategories />
                  : <Navigate to="/categories" replace />
              }
            />

            <Route
              path="/categories/add"
              element={
                isAdminOrStaff
                  ? <AddCategory />
                  : <Navigate to="/categories" replace />
              }
            />

            <Route
              path="/categories/edit/:id"
              element={
                isAdminOrStaff
                  ? <EditCategory />
                  : <Navigate to="/categories" replace />
              }
            />
            */}

            {/* ================= BRAND ADMIN ================= */}

            {/*
            <Route
              path="/brands/manage"
              element={
                isAdminOrStaff
                  ? <ManageBrands />
                  : <Navigate to="/brands" replace />
              }
            />

            <Route
              path="/brands/add"
              element={
                isAdminOrStaff
                  ? <AddBrand />
                  : <Navigate to="/brands" replace />
              }
            />

            <Route
              path="/brands/edit/:id"
              element={
                isAdminOrStaff
                  ? <EditBrand />
                  : <Navigate to="/brands" replace />
              }
            />
            */}

            {/* ================= 404 ================= */}

            <Route
              path="*"
              element={<h2>404 - Page Not Found</h2>}
            />

          </Routes>

        </main>

      </div>
       <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;