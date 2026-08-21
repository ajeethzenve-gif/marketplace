import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaBox,
  FaTags,
  FaList,
  FaUsers,
  FaClipboardList,
  FaCog,
  FaTicketAlt,
} from "react-icons/fa";


function Sidebar() {


  const role = localStorage.getItem("role");


  const isAdmin = role === "Admin";

  const isStaff = role === "Staff";

  const isEmployee = role === "Employee";

  const isManagementRole =
    isAdmin || isStaff || isEmployee;

  const [couponOpen, setCouponOpen] = useState(false);



  const [productOpen, setProductOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);



  return (

    <aside className="sidebar">


      <h3 className="sidebar-title">
        Dashboard
      </h3>


      <nav>


        {/* Products - Everyone */}





        {/* Product Management */}

        {isManagementRole && (

          <>

            <div
              className="menu-item submenu-title"
              onClick={() =>
                setProductOpen(!productOpen)
              }
            >

              <span>
                <FaBox /> Product Management
              </span>


              {
                productOpen
                ?
                <FaChevronDown />
                :
                <FaChevronRight />
              }


            </div>



            {
              productOpen &&

              <div className="submenu">

                <Link
                  to="/products/add"
                  className="submenu-item"
                >
                  ➕ Add Product
                </Link>


                <Link
                  to="/products/manage"
                  className="submenu-item"
                >
                  📝 Manage Products
                </Link>


              </div>
            }


          </>

        )}






        {/* Categories */}


        {
          isManagementRole &&

          <>


            <div
              className="menu-item submenu-title"
              onClick={() =>
                setCategoryOpen(!categoryOpen)
              }
            >

              <span>
                <FaList /> Category Management
              </span>


              {
                categoryOpen
                ?
                <FaChevronDown />
                :
                <FaChevronRight />
              }


            </div>




            {
              categoryOpen &&

              <div className="submenu">


                <Link
                  to="/categories/add"
                  className="submenu-item"
                >
                  ➕ Add Category
                </Link>


                <Link
                  to="/categories/manage"
                  className="submenu-item"
                >
                  📝 Manage Categories
                </Link>


              </div>
            }



          </>
        }





        {/* Brands */}




        {
          isManagementRole &&


          <>


            <div
              className="menu-item submenu-title"
              onClick={() =>
                setBrandOpen(!brandOpen)
              }
            >

              <span>
                <FaTags /> Brand Management
              </span>


              {
                brandOpen
                ?
                <FaChevronDown />
                :
                <FaChevronRight />
              }


            </div>




            {
              brandOpen &&

              <div className="submenu">


                <Link
                  to="/brands/add"
                  className="submenu-item"
                >
                  ➕ Add Brand
                </Link>



                <Link
                  to="/brands/manage"
                  className="submenu-item"
                >
                  📝 Manage Brands
                </Link>



              </div>

            }


          </>

        }






        {/* Customer Management - Admin Only */}


        {
          isAdmin &&

          <>


            <div
              className="menu-item submenu-title"
              onClick={() =>
                setCustomerOpen(!customerOpen)
              }
            >

              <span>
                <FaUsers /> Customer Management
              </span>


              {
                customerOpen
                ?
                <FaChevronDown />
                :
                <FaChevronRight />
              }


            </div>



            {
              customerOpen &&

              <div className="submenu">


                <Link
                  to="/customers"
                  className="submenu-item"
                >
                  👥 Customer List
                </Link>


              </div>

            }


          </>

        }


        {/* Orders */}

        {
          isManagementRole

          ?

          <>


            <div
              className="menu-item submenu-title"
              onClick={() =>
                setOrderOpen(!orderOpen)
              }
            >

              <span>
                <FaClipboardList />
                Order Management
              </span>


              {
                orderOpen
                ?
                <FaChevronDown />
                :
                <FaChevronRight />
              }


            </div>



            {
              orderOpen &&

              <div className="submenu">


                <Link
                  to="/total-orders"
                  className="submenu-item"
                >
                  📋 Order List
                </Link>


              </div>

            }


          </>


          :

          <Link
            to="/orders"
            className="menu-item"
          >
            📦 My Orders
          </Link>


        }

        {/* Coupon Management - Admin Only */}

        {
          isAdmin && (

            <>

              <div
                className="menu-item submenu-title"
                onClick={() => setCouponOpen(!couponOpen)}
              >

                <span>
                  <FaTicketAlt /> Coupon Management
                </span>

                {
                  couponOpen
                    ? <FaChevronDown />
                    : <FaChevronRight />
                }

              </div>

              {
                couponOpen && (

                  <div className="submenu">

                    <Link
                      to="/admin/coupons/add"
                      className="submenu-item"
                    >
                      ➕ Add Coupon
                    </Link>

                    <Link
                      to="/admin/coupons"
                      className="submenu-item"
                    >
                      🎟 Manage Coupons
                    </Link>

                  </div>

                )
              }

            </>

          )
        }





        {/* Settings - Everyone */}

        <Link
          to="/settings"
          className="menu-item"
        >
          <FaCog />
          Settings
        </Link>



      </nav>


    </aside>

  );

}


export default Sidebar;