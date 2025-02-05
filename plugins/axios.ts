// import axios from "axios";
// import { useRuntimeConfig } from "#app";

// export default defineNuxtPlugin((nuxtApp) => {
//   const config = useRuntimeConfig();

//   const api = axios.create({
//     baseURL: config.public.apiBaseUrl as string, // Use runtime config for dynamic API URL
//   });

//   // Optional: Add request/response interceptors
//   api.interceptors.request.use((config) => {
//     console.log("Request sent:", config);
//     return config;
//   });

//   api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       console.error("Axios error:", error);
//       return Promise.reject(error);
//     }
//   );

//   // Attach Axios instance globally
//   nuxtApp.provide("axios", api);
// });
