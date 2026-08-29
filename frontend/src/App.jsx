import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useState } from "react";
import ScrollToTop from "./components/ScrollToTop";
// ================= COMPONENTS =================

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer.jsx";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword.jsx";

// ================= PUBLIC PAGES =================

import Home from "./pages/Home.jsx";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import CategoryList from "./pages/CategoryList";
import BrandList from "./pages/BrandList";
import Offers from "./pages/Offers";
import PetAdoption from "./pages/PetAdoption";
import HomeVisit from "./pages/HomeVisit";
import Services from "./pages/Services";
import Help from "./pages/Help";
import Wallet from "./pages/Wallet";
import AddMoney from "./pages/AddMoney";
import RefundAndReturn from "./pages/RefundAndReturn";

import Cart from "./pages/Card";
import Orders from "./pages/Orders";
import WishList from "./pages/WishList";
import Review from "./pages/Review";
import PrescriptionUpload from "./pages/PrescriptionUpload.jsx";
import PetProfile from "./pages/PetProfile.jsx";
import RecommendedProducts from "./pages/RecommendedProducts";
import Payment from "./pages/Payment.jsx";
import Membership from "./pages/Membership";

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

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgotpassword";


  // =====================================================
  // ADMIN PAGE
  // =====================================================

  /*
   * Admin/Staff should not see the public Home page.
   *
   * If Admin/Staff manually visits:
   *
   * /home
   *
   * they will automatically be redirected to:
   *
   * /products/manage
   */

  const isAdminHomePage =
    isAdminOrStaff &&
    location.pathname === "/home";


  // =====================================================
  // HIDE LAYOUT
  // =====================================================

  const hideLayout =
    isAuthPage;


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
            setShowSidebar(
              (previous) => !previous
            )
          }
        />
      )}


      {/* =================================================
          MAIN APP LAYOUT
      ================================================= */}

      <div
        className={
          isAdminOrStaff
            ? "app-layout admin-layout"
            : "app-layout"
        }
      >


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
              : isAdminOrStaff
                ? "main-content admin-main-content"
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
                isAdminOrStaff ? (
                  <Navigate
                    to="/products/manage"
                    replace
                  />
                ) : (
                  <Navigate
                    to="/home"
                    replace
                  />
                )
              }
            />


            {/* =================================================
                HOME
            ================================================= */}

            <Route
              path="/home"
              element={
                isAdminOrStaff ? (
                  <Navigate
                    to="/products/manage"
                    replace
                  />
                ) : (
                  <Home />
                )
              }
            />


            {/* =================================================
                PRODUCTS
            ================================================= */}

            <Route
              path="/Products"
              element={<ProductList />}
            />


            <Route
              path="/products/:id"
              element={<ProductDetails />}
            />


            {/* =================================================
                CATEGORIES
            ================================================= */}

            <Route
              path="/categories"
              element={<CategoryList />}
            />


            {/* =================================================
                BRANDS
            ================================================= */}

            <Route
              path="/brands"
              element={<BrandList />}
            />


            {/* =================================================
                OFFERS
            ================================================= */}

            <Route
              path="/offers"
              element={<Offers />}
            />
            <Route
                path="/services"
                element={<Services />}
            />
            <Route
                path="/help"
                element={<Help />}
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
            <Route
                path="/wallet"
                element={<Wallet />}
            />
            <Route
                path="/wallet/add-money"
                element={<AddMoney />}
            />

              <Route path="/refund-return"
                     element={<RefundAndReturn />}
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
            <Route
                path="/membership"
                element={<Membership />}
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
                PRESCRIPTION
            ================================================= */}

            <Route
              path="/prescription/upload"
              element={<PrescriptionUpload />}
            />

            <Route path="/adoption" element={<PetAdoption />} />

              <Route path="/home-visit" element={<HomeVisit />} />

            {/* =================================================
                PAYMENT
            ================================================= */}

            <Route
              path="/payment"
              element={<Payment />}
            />


            {/* =================================================
                LOGIN
            ================================================= */}

            <Route
              path="/login"
              element={<Login />}
            />


            {/* =================================================
                REGISTER
            ================================================= */}

            <Route
              path="/register"
              element={<Register />}
            />


            {/* =================================================
                FORGOT PASSWORD
            ================================================= */}

            <Route
              path="/forgotpassword"
              element={<ForgotPassword />}
            />


            {/* =================================================
                CUSTOMER LIST
            ================================================= */}

            <Route
              path="/customers"
              element={
                isAdminOrStaff ? (
                  <CustomerList />
                ) : (
                  <Navigate
                    to="/products"
                    replace
                  />
                )
              }
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
                isAdminOrStaff ? (
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
                404
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
      <ScrollToTop />
      <AppContent />

    </BrowserRouter>
  );
}


// =====================================================
// EXPORT
// =====================================================

export default App;