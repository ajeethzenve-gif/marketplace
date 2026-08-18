import "../styles/Pagination.css"

function Pagination({

    page,

    totalPages,

    setPage

}){

    const pages=[];

    for(let i=1;i<=totalPages;i++){

        pages.push(i);

    }

    return(

        <div className="pagination-container">

            <button

                disabled={page===1}

                onClick={()=>setPage(page-1)}

            >

                Previous

            </button>

            {

                pages.map((number)=>(

                    <button

                        key={number}

                        className={
                            page===number
                            ?
                            "active-page"
                            :
                            ""
                        }

                        onClick={()=>setPage(number)}

                    >

                        {number}

                    </button>

                ))

            }

            <button

                disabled={page===totalPages}

                onClick={()=>setPage(page+1)}

            >

                Next

            </button>

        </div>

    );

}

export default Pagination;