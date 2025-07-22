import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7205', // Update with your .NET API base URL
});

export default axiosInstance;