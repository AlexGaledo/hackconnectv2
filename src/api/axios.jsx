import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";

const connector = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});


export { connector };