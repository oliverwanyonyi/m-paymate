import axios from 'axios';

// Create an instance of Axios with base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials:true
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Modify config here
    const user = localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')) : null // Assuming you have a function to get the user with a token
    if (user?.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export {axiosInstance}