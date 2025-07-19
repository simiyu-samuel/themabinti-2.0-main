import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'https://themabinti-main-d4az.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 
