import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

export default api;

// //For mobile useage:
// import axios from "axios";
//
// const api = axios.create({
//     baseURL: "http://192.168.1.16:8000/api/",
// });
//
// export default api;