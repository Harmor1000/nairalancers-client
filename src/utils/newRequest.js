import axios from "axios";

// Use environment-driven API URL for production and development
const API_URL = (import.meta?.env?.VITE_API_URL)
  || (typeof window !== 'undefined' && window.__API_URL__)
  || "http://localhost:8800";
const base = String(API_URL).replace(/\/$/, "");

const newRequest = axios.create({
  baseURL: `${base}/api/`,
  withCredentials: true,
});

export default newRequest;
//     withCredentials: true,
// });

// export default newRequest;