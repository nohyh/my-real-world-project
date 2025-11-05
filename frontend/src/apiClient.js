import axios from 'axios';
const BASE_URL = 'https://api.realworld.show/api';
const apiClient = axios.create({
  baseURL: BASE_URL,
});
export default apiClient;