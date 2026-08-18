import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/Wishlist.css";


function Wishlist() {


    const navigate = useNavigate();


    const [wishlist, setWishlist] = useState([]);

    const [loading, setLoading] = useState(true);



    useEffect(() => {

        loadWishlist();

    }, []);




    const getHeaders = () => {

        return {

            headers: {

                Authorization:
                    `Bearer ${localStorage.getItem("access")}`

            }

        };

    };




    const loadWishlist = async () => {


        const token = localStorage.getItem("access");


        if (!token) {

            navigate("/login");

            return;

        }



        try {


            const response = await axios.get(

                "http://127.0.0.1:8000/api/wishlist/",

                getHeaders()

            );


            setWishlist(response.data);



        }

        catch(error){


            console.log(
                "Wishlist Load Error:",
                error.response?.data
            );


        }

        finally{


            setLoading(false);


        }


    };





    const removeWishlist = async(productId)=>{


        try{


            await axios.delete(

                `http://127.0.0.1:8000/api/wishlist/remove/${productId}/`,

                getHeaders()

            );


            setWishlist(

                wishlist.filter(

                    item =>
                    item.product !== productId

                )

            );



        }

        catch(error){


            console.log(
                "Remove Wishlist Error:",
                error.response?.data
            );


        }


    };





    const addToCart = async(productId)=>{


        try{


            await axios.post(

                "http://127.0.0.1:8000/api/cart/add/",

                {

                    product_id: productId,

                    quantity:1

                },

                getHeaders()

            );


            alert(
                "Product added to cart"
            );


        }

        catch(error){


            console.log(
                "Cart Error:",
                error.response?.data
            );


        }


    };





    if(loading){


        return (

            <h2 className="text-center mt-5">

                Loading...

            </h2>

        );


    }







    return (

        <div className="container mt-4">


            <h2 className="mb-4 text-center">

                ❤️ My Wishlist

            </h2>





            {

                wishlist.length === 0 ?


                (

                    <div className="text-center">

                        <h4>

                            Your wishlist is empty.

                        </h4>


                    </div>

                )


                :


                (

                    <div className="row">


                        {

                            wishlist.map((item)=>(


                                <div

                                    className="col-md-4 mb-4"

                                    key={item.id}

                                >



                                    <div className="card h-100 shadow">





                                        <img


                                            src={

                                                item.product_image

                                                ?

                                                item.product_image

                                                :

                                                "https://via.placeholder.com/300x220"

                                            }


                                            className="card-img-top"

                                            alt={item.product_name}

                                        />







                                        <div className="card-body d-flex flex-column">



                                            <h5>

                                                {item.product_name}

                                            </h5>




                                            <p>

                                                <strong>
                                                Category :
                                                </strong>

                                                {" "}

                                                {item.category_name}

                                            </p>





                                            <p>

                                                <strong>
                                                Brand :
                                                </strong>

                                                {" "}

                                                {item.brand_name}

                                            </p>





                                            <p>

                                                <strong>
                                                Price :
                                                </strong>

                                                {" ₹"}

                                                {item.price}

                                            </p>






                                            <div className="mt-auto">


                                                <div className="row g-2">



                                                    <div className="col-4">


                                                        <Link

                                                            to={`/products/${item.product}`}

                                                            className="btn btn-primary w-100"

                                                        >

                                                            Details


                                                        </Link>


                                                    </div>





                                                    <div className="col-4">


                                                        <button

                                                            className="btn btn-warning w-100"

                                                            onClick={()=>addToCart(item.product)}

                                                        >

                                                            Cart


                                                        </button>


                                                    </div>






                                                    <div className="col-4">


                                                        <button

                                                            className="btn btn-danger w-100"

                                                            onClick={()=>removeWishlist(item.product)}

                                                        >

                                                            Remove


                                                        </button>


                                                    </div>




                                                </div>



                                            </div>




                                        </div>



                                    </div>



                                </div>


                            ))

                        }



                    </div>


                )

            }



        </div>


    );

}


export default Wishlist;