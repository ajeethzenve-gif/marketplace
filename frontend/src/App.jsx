import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useState } from "react";

// ================= COMPONENTS =================

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer.jsx";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword.jsx";
import TopBar from "./components/TopBar.jsx";
import Pagination from "./components/Pagination";

// ================= PUBLIC PAGES =================

import Home from "./pages/Home.jsx";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import CategoryList from "./pages/CategoryList";
import BrandList from "./pages/BrandList";
import Offers from "./pages/Offers";

import Cart from "./pages/Card";
import Orders from "./pages/Orders";
import WishList from "./pages/WishList";
import Review from "./pages/Review";
import PrescriptionUpload from "./pages/PrescriptionUpload.jsx";
import PetProfile from "./pages/PetProfile.jsx";
import RecommendedProducts from "./pages/RecommendedProducts";
import Payment from "./pages/Payment.jsx";

// ================= ADMIN =================

import ManageProducts from "./admin/ManageProducts";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";

import CustomerList from "./admin/CustomerList.jsx";
import OrderList from "./admin/OrderList";

import CouponList from "./admin/CouponList";
import AddCoupon from "./admin/AddCoupon";

// ================= CSS =================

import "./App.css";


// =====================================================
// APP CONTENT
// =====================================================

function AppContent() {

  const [showSidebar, setShowSidebar] = useState(true);

  const location = useLocation();

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("access");

  const isLoggedIn = !!token;

  const isAdminOrStaff =
    role === "Admin" ||
    role === "Staff";

  const isCustomer =
    role === "Customer";


  // =====================================================
  // AUTH PAGES
  // =====================================================
  // Navbar, Sidebar and Footer will be hidden
  // on Login, Register and Forgot Password pages.
  // =====================================================

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgotpassword";


  // =====================================================
  // RETURN
  // =====================================================

  return (
    <>

      {/* =================================================
          NAVBAR
      ================================================= */}

      {!hideLayout && (
        <Navbar
          toggleSidebar={() =>
            setShowSidebar((previous) => !previous)
          }
        />
      )}


      {/* =================================================
          MAIN APP LAYOUT
      ================================================= */}

      <div className="app-layout">


        {/* =================================================
            SIDEBAR
        ================================================= */}

        {!hideLayout &&
          isLoggedIn &&
          !isCustomer &&
          showSidebar && (
            <Sidebar />
          )}


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main
          className={
            hideLayout
              ? "auth-content"
              : "main-content"
          }
        >

          <Routes>

            {/* =================================================
                ROOT
            ================================================= */}

            <Route
              path="/"
              element={
                <Navigate
                  to="/home"
                  replace
                />
              }
            />


            {/* =================================================
                PUBLIC PAGES
            ================================================= */}

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


            <Route
              path="/offers"
              element={<Offers />}
            />


            {/* =================================================
                CART
            ================================================= */}

            <Route
              path="/cart"
              element={<Cart />}
            />


            {/* =================================================
                ORDERS
            ================================================= */}

            <Route
              path="/orders"
              element={<Orders />}
            />


            {/* =================================================
                WISHLIST
            ================================================= */}

            <Route
              path="/wishlists"
              element={<WishList />}
            />


            {/* =================================================
                REVIEWS
            ================================================= */}

            <Route
              path="/products/:id/reviews"
              element={<Review />}
            />


            {/* =================================================
                PET PROFILE
            ================================================= */}

            <Route
              path="/pets"
              element={<PetProfile />}
            />


            {/* =================================================
                RECOMMENDED PRODUCTS
            ================================================= */}

            <Route
              path="/recommended-products/:petId"
              element={<RecommendedProducts />}
            />


            {/* =================================================
                PROFILE
            ================================================= */}

            <Route
              path="/profile"
              element={<Profile />}
            />


            {/* =================================================
                PRESCRIPTION UPLOAD
            ================================================= */}

            <Route
              path="/prescription/upload"
              element={<PrescriptionUpload />}
            />


            {/* =================================================
                PAYMENT
            ================================================= */}

            <Route
              path="/payment"
              element={<Payment />}
            />


            {/* =================================================
                AUTHENTICATION
            ================================================= */}

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
              element={<ForgotPassword />}
            />


            {/* =================================================
                CUSTOMER LIST
            ================================================= */}

            <Route
              path="/customers"
              element={<CustomerList />}
            />


            {/* =================================================
                ADMIN - MANAGE PRODUCTS
            ================================================= */}

            <Route
              path="/products/manage"
              element={
                isAdminOrStaff ? (
                  <ManageProducts />
                ) : (
                  <Navigate
                    to="/products"
                    replace
                  />
                )
              }
            />


            {/* =================================================
                ADMIN - ADD PRODUCT
            ================================================= */}

            <Route
              path="/products/add"
              element={
                isAdminOrStaff ? (
                  <AddProduct />
                ) : (
                  <Navigate
                    to="/products"
                    replace
                  />
                )
              }
            />


            {/* =================================================
                ADMIN - TOTAL ORDERS
            ================================================= */}

            <Route
              path="/total-orders"
              element={
                role === "Admin" ||
                role === "Staff" ? (
                  <OrderList />
                ) : (
                  <Navigate
                    to="/products"
                    replace
                  />
                )
              }
            />


            {/* =================================================
                ADMIN - EDIT PRODUCT
            ================================================= */}

            <Route
              path="/products/edit/:id"
              element={
                isAdminOrStaff ? (
                  <EditProduct />
                ) : (
                  <Navigate
                    to="/products"
                    replace
                  />
                )
              }
            />


            {/* =================================================
                ADMIN - COUPONS
            ================================================= */}

            <Route
              path="/admin/coupons"
              element={
                isAdminOrStaff ? (
                  <CouponList />
                ) : (
                  <Navigate
                    to="/products"
                    replace
                  />
                )
              }
            />


            {/* =================================================
                ADMIN - ADD COUPON
            ================================================= */}

            <Route
              path="/admin/coupons/add"
              element={
                isAdminOrStaff ? (
                  <AddCoupon />
                ) : (
                  <Navigate
                    to="/products"
                    replace
                  />
                )
              }
            />


            {/* =================================================
                404 PAGE
            ================================================= */}

            <Route
              path="*"
              element={
                <h2>
                  404 - Page Not Found
                </h2>
              }
            />

          </Routes>

        </main>

      </div>


      {/* =================================================
          FOOTER
      ================================================= */}
      {/* Footer will NOT appear on:
          /login
          /register
          /forgotpassword
      */}

      {!hideLayout && <Footer />}

    </>
  );
}


// =====================================================
// APP
// =====================================================

function App() {

  return (
    <BrowserRouter>

      <AppContent />

    </BrowserRouter>
  );
}


// =====================================================
// EXPORT
// =====================================================

export default App;