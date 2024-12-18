import axios from "axios";
import { serverURL } from "@/config";

export const axiosInstance = axios.create({
  baseURL: serverURL,
  headers: {
    "Content-Type": "application/json",
  },
});
