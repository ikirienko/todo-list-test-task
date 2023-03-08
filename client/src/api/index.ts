import axios from "axios";

export const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  },
  timeout: 5000,
});
