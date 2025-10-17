import axios from 'axios';
import { config } from '../config/config.js';

const api = axios.create({
    baseURL: config.apiUrl,
});

export default api;