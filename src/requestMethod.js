import axios from 'axios';
import { BACKEND_URL,BASIC_KEY } from './config/config';
import swal from 'sweetalert';

// Base URLs
const eurekaphorbesBaseUrl = BACKEND_URL;

// Public Request Instance (With Basic Auth)
export const publicRequest = axios.create({
  baseURL: eurekaphorbesBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization':`Basic ${BASIC_KEY}`,
  },
});

// User Request Instance (With Access Token)
const userRequest = axios.create({
  baseURL: eurekaphorbesBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token Storage and Helper Functions
let accessToken = localStorage.getItem('accessToken') || '';

export const setTokens = (newAccessToken) => {
  accessToken = newAccessToken;
  localStorage.setItem('accessToken', newAccessToken);
};

export const clearTokens = () => {
  accessToken = '';
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

// Add Authorization Header to UserRequest
userRequest.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

userRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearTokens();
      swal({
        title: 'Session Expired',
        text: 'Your session has expired. Please log in again.',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(() => {
        window.location.href = '/login';
      });
    }
    return Promise.reject(error);
  }
);

export { userRequest };
