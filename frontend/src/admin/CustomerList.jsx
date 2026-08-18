import { useEffect, useState } from "react";
import axios from "axios";
import "./Customer.css";

function CustomerList() {

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/api/accounts/customers/",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                }
            );

            setCustomers(response.data);

        } catch (error) {

            console.log(error);

            alert("Unable to load customers.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="customer-page">

            <div className="customer-header">

                <h2>Customers</h2>

                <div className="customer-count">
                    Total Customers : <strong>{customers.length}</strong>
                </div>

            </div>

            <div className="table-responsive">

                <table className="customer-table">

                    <thead>

                        <tr>

                            <th>Sl.No</th>

                            <th>Full Name</th>

                            <th>Username</th>

                            <th>Email</th>

                            <th>Phone</th>

                            <th>City</th>

                            <th>State</th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>

                                <td
                                    colSpan="7"
                                    style={{ textAlign: "center" }}
                                >
                                    Loading...
                                </td>

                            </tr>

                        ) : customers.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="7"
                                    style={{ textAlign: "center" }}
                                >
                                    No Customers Found
                                </td>

                            </tr>

                        ) : (

                            customers.map((customer, index) => (

                                <tr key={customer.id}>

                                    <td>{index + 1}</td>

                                    <td>
                                        {customer.first_name} {customer.last_name}
                                    </td>

                                    <td>{customer.username}</td>

                                    <td>{customer.email}</td>

                                    <td>{customer.phone_number}</td>

                                    <td>{customer.city}</td>

                                    <td>{customer.state}</td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default CustomerList;