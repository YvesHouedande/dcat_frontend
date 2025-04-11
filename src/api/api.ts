import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://example.com/api",
<<<<<<< HEAD
  timeout: 5000,
=======
  timeout: 15000,
>>>>>>> 9ef29a9 (jjk)
  headers: { "Content-Type": "application/json" },
});
   