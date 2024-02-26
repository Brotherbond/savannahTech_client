import axios from "axios";
import routes from "./routes";
import { getSession } from "next-auth/react";
import Swal from "sweetalert2";


export const fetcher = async <T>(...args: [url: string, init?: RequestInit]) =>
  fetch(...args).then((res) => res.json() as Promise<T>);


export const sendRequest = async (url: string, body: { arg: {} }) => {
  return await (await api()).post(url, body.arg).catch((error) => {
    console.error(error);
  });
};


const api = async () => {
  const api = axios.create({
    baseURL: routes.api.baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    validateStatus: (status) => status >= 200 && status < 400,
  });

  try {
    let token = (await getSession())?.token
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error during API setup:", error);
  }

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API request error:", error);
      Swal.fire(error.response.data.message);
      return Promise.reject(error);
    }
  );

  return api;
};

export default api;
