import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";

function Profile() {

    const [profileImage, setProfileImage] = useState(null);

    const [preview, setPreview] = useState("");

    const [formData, setFormData] = useState({

        first_name: "",

        last_name: "",

        username: "",

        email: "",

        phone_number: "",

        gender: "",

        date_of_birth: "",

        address: "",

        city: "",

        state: "",

        country: "",

        postal_code: "",

    });

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const response = await axios.get(

                "http://127.0.0.1:8000/api/accounts/profile/",

                {

                    headers: {

                        Authorization:
                            `Bearer ${localStorage.getItem("access")}`

                    }

                }

            );

            setFormData({

                first_name: response.data.first_name,

                last_name: response.data.last_name,

                username: response.data.username,

                email: response.data.email,

                phone_number: response.data.phone_number,

                gender: response.data.gender,

                date_of_birth: response.data.date_of_birth,

                address: response.data.address,

                city: response.data.city,

                state: response.data.state,

                country: response.data.country,

                postal_code: response.data.postal_code,

            });

            if (response.data.profile_image) {

                setPreview(

                    `http://127.0.0.1:8000${response.data.profile_image}`

                );

            }

        }

        catch (error) {

            console.log(error);

        }

    };

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleImage = (e) => {

        const file = e.target.files[0];

        setProfileImage(file);

        setPreview(URL.createObjectURL(file));

    };
        const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = new FormData();

            data.append("first_name", formData.first_name);
            data.append("last_name", formData.last_name);
            data.append("username", formData.username);
            data.append("email", formData.email);
            data.append("phone_number", formData.phone_number);
            data.append("gender", formData.gender);
            data.append("date_of_birth", formData.date_of_birth);
            data.append("address", formData.address);
            data.append("city", formData.city);
            data.append("state", formData.state);
            data.append("country", formData.country);
            data.append("postal_code", formData.postal_code);

            if (profileImage) {

                data.append("profile_image", profileImage);

            }

            await axios.put(

                "http://127.0.0.1:8000/api/accounts/profile/update/",

                data,

                {

                    headers: {

                        Authorization:
                            `Bearer ${localStorage.getItem("access")}`,

                        "Content-Type":
                            "multipart/form-data",

                    },

                }

            );

            alert("Profile updated successfully.");

        }

        catch (error) {

            console.log(error.response.data);

            alert("Failed to update profile.");

        }

    };

    return (

        <div className="profile-page">

            <div className="profile-card">

                <h2 className="text-center mb-4">

                    My Profile

                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="text-center mb-4">

                        <img

                            src={
                                preview ||
                                "https://via.placeholder.com/150"
                            }

                            alt="Profile"

                            className="profile-image"

                        />

                        <input

                            type="file"

                            className="form-control mt-3"

                            accept="image/*"

                            onChange={handleImage}

                        />

                    </div>

                    <div className="row">

                        <div className="col-md-6 mb-3">

                            <label>

                                First Name

                            </label>

                            <input

                                type="text"

                                className="form-control"

                                name="first_name"

                                value={formData.first_name}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>

                                Last Name

                            </label>

                            <input

                                type="text"

                                className="form-control"

                                name="last_name"

                                value={formData.last_name}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>

                                Username

                            </label>

                            <input

                                type="text"

                                className="form-control"

                                name="username"

                                value={formData.username}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>

                                Email

                            </label>

                            <input

                                type="email"

                                className="form-control"

                                name="email"

                                value={formData.email}

                                onChange={handleChange}

                            />

                        </div>
                                <div className="col-md-6 mb-3">

                            <label>

                                Phone Number

                            </label>

                            <input

                                type="text"

                                className="form-control"

                                name="phone_number"

                                value={formData.phone_number}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>

                                Gender

                            </label>

                            <select

                                className="form-select"

                                name="gender"

                                value={formData.gender}

                                onChange={handleChange}

                            >

                                <option value="">

                                    Select Gender

                                </option>

                                <option value="Male">

                                    Male

                                </option>

                                <option value="Female">

                                    Female

                                </option>

                                <option value="Other">

                                    Other

                                </option>

                            </select>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>

                                Date of Birth

                            </label>

                            <input

                                type="date"

                                className="form-control"

                                name="date_of_birth"

                                value={formData.date_of_birth}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>

                                Country

                            </label>

                            <input

                                type="text"

                                className="form-control"

                                name="country"

                                value={formData.country}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="col-12 mb-3">

                            <label>

                                Address

                            </label>

                            <textarea

                                className="form-control"

                                rows="4"

                                name="address"

                                value={formData.address}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="col-md-4 mb-3">

                            <label>

                                City

                            </label>

                            <input

                                type="text"

                                className="form-control"

                                name="city"

                                value={formData.city}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="col-md-4 mb-3">

                            <label>

                                State

                            </label>

                            <input

                                type="text"

                                className="form-control"

                                name="state"

                                value={formData.state}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="col-md-4 mb-3">

                            <label>

                                Postal Code

                            </label>

                            <input

                                type="text"

                                className="form-control"

                                name="postal_code"

                                value={formData.postal_code}

                                onChange={handleChange}

                            />

                        </div>

                    </div>
                            <div className="text-center mt-4">

                        <button

                            type="submit"

                            className="btn btn-success profile-btn"

                        >

                            Update Profile

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default Profile;