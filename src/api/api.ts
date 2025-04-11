import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://example.com/api",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});
   