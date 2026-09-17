import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useState } from "react";

import ScrollToTop from "./components/ScrollToTop";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer.jsx";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword.jsx";

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

import Booked from "./pages/Booked.jsx";

import ManageProducts from "./admin/ManageProducts";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";

import CustomerList from "./admin/CustomerList.jsx";
import OrderList from "./admin/OrderList";

import CouponList from "./admin/CouponList";
import AddCoupon from "./admin/AddCoupon";

import "./App.css";


function AppContent() {

  const [showSidebar, setShowSidebar] = useState(true);

  const location = useLocation();

  const role = localStorage.getItem("role");

  const token = localStorage.getItem("access");

  const isLoggedIn = !!token;

  const isAdminOrStaff =
    role === "Admin" ||
    role === "Staff";

  const isCustomer =
    role === "Customer";

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgotpassword";

  const hideLayout =
    isAuthPage;


  return (
    <>

      {!hideLayout && (
        <Navbar
          toggleSidebar={() =>
            setShowSidebar(
              (previous) => !previous
            )
          }
        />
      )}


      <div
        className={
          isAdminOrStaff
            ? "app-layout admin-layout"
            : "app-layout"
        }
      >


        {!hideLayout &&
          isLoggedIn &&
          !isCustomer &&
          showSidebar && (
            <Sidebar />
          )}


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


            <Route
              path="/services"
              element={<Services />}
            />


            <Route
              path="/help"
              element={<Help />}
            />


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
              path="/wallet"
              element={<Wallet />}
            />

            <Route
              path="/wallet/add-money"
              element={<AddMoney />}
            />


            <Route
              path="/refund-return"
              element={<RefundAndReturn />}
            />


            <Route
              path="/products/:id/reviews"
              element={<Review />}
            />


            <Route
              path="/pets"
              element={<PetProfile />}
            />


            <Route
              path="/membership"
              element={<Membership />}
            />


            <Route
              path="/vet-booked"
              element={<Booked />}
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
              path="/adoption"
              element={<PetAdoption />}
            />


            <Route
              path="/home-visit"
              element={<HomeVisit />}
            />


            <Route
              path="/payment"
              element={<Payment />}
            />


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


            <Route
              path="*"
              element={
                <h2 className="p-6">
                  404 - Page Not Found
                </h2>
              }
            />

          </Routes>

        </main>

      </div>


      {!hideLayout && <Footer />}

    </>
  );
}


function App() {

  return (
    <BrowserRouter>

      <ScrollToTop />

      <AppContent />

    </BrowserRouter>
  );
}


export default App;