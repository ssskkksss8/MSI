import axios from 'axios';
import { toast } from 'react-toastify';

export const api = axios.create({
  baseURL: '/api', // Adjust based on your backend configuration
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to attach the token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          toast.error(`Bad Request: ${data}`);
          break;
        case 401:
          toast.error('Unauthorized: Please log in again');
          // Redirect to login if unauthorized
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('Forbidden: You do not have permission to access this resource');
          break;
        case 404:
          toast.error('Not Found: The requested resource does not exist');
          break;
        case 500:
          toast.error('Server Error: Please try again later');
          break;
        default:
          toast.error(`Error ${status}: ${data}`);
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('Network Error: Unable to connect to the server');
    } else {
      // Something happened in setting up the request
      toast.error(`Error: ${error.message}`);
    }
    
    return Promise.reject(error);
  }
);

export default api;