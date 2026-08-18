import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";


function Review() {


    const { id } = useParams();


    const [reviews,setReviews] = useState([]);

    const [rating,setRating] = useState(5);

    const [review,setReview] = useState("");

    const [loading,setLoading] = useState(false);


    const token = localStorage.getItem("access");

    const username = localStorage.getItem("username");



    useEffect(()=>{

        loadReviews();

    },[id]);




    const loadReviews = async()=>{


        try{


            const response = await axios.get(

                `http://127.0.0.1:8000/api/reviews/${id}/`

            );


            setReviews(response.data);


        }

        catch(error){

            console.log(
                "Review loading error:",
                error.response?.data
            );

        }

    };





    const submitReview = async()=>{


        if(!token){

            alert(
                "Please login first"
            );

            return;

        }



        if(!review.trim()){

            alert(
                "Please write a review"
            );

            return;

        }



        try{


            setLoading(true);



            await axios.post(

                "http://127.0.0.1:8000/api/reviews/add/",

                {

                    product_id:id,

                    rating:rating,

                    review:review

                },


                {

                    headers:{

                        Authorization:
                        `Bearer ${token}`

                    }

                }

            );



            alert(
                "Review added successfully"
            );



            setReview("");

            setRating(5);



            loadReviews();



        }

        catch(error){


            console.log(
                "Add review error:",
                error.response?.data
            );


        }

        finally{


            setLoading(false);


        }

    };







    const deleteReview = async(reviewId)=>{


        try{


            await axios.delete(


                `http://127.0.0.1:8000/api/reviews/delete/${reviewId}/`,


                {

                    headers:{

                        Authorization:
                        `Bearer ${token}`

                    }

                }


            );



            loadReviews();



        }

        catch(error){


            console.log(
                "Delete error:",
                error.response?.data
            );


        }


    };






return (

<div className="container mt-4">


<h2>
    Product Reviews
</h2>



<div className="card p-4 mb-4">


<h4>
    Add Your Review
</h4>



<div>


{

[1,2,3,4,5].map((star)=>(


<FaStar

key={star}

size={30}

style={{

cursor:"pointer",

marginRight:"8px"

}}

color={

star<=rating

?

"orange"

:

"#ccc"

}


onClick={()=>setRating(star)}


/>


))

}


</div>




<textarea

className="form-control mt-3 mb-3"

rows="4"

placeholder="Write your review"

value={review}

onChange={(e)=>setReview(e.target.value)}


/>




<button

className="btn btn-primary"

onClick={submitReview}

disabled={loading}


>


{

loading

?

"Submitting..."

:

"Submit Review"

}


</button>



</div>





<h3>
Customer Reviews
</h3>




{

reviews.length===0

?

<p>
No Reviews Yet
</p>


:


reviews.map((item)=>(


<div

className="card p-3 mb-3"

key={item.id}

>



<div className="d-flex justify-content-between">


<div>


<h5>

{item.customer_name}

</h5>



<div>


{

[1,2,3,4,5].map((star)=>(


<FaStar

key={star}

color={

star <= item.rating

?

"orange"

:

"#ddd"

}


/>


))

}


</div>


</div>




{


item.customer_name === username &&


<button

className="btn btn-danger btn-sm"

onClick={()=>deleteReview(item.id)}

>

Delete

</button>


}




</div>





<p className="mt-3">

{item.review}

</p>



<small>

{

new Date(

item.created_at

).toLocaleString()

}


</small>



</div>



))


}




</div>


);


}


export default Review;