import axios from 'axios';

const API_BASE_URL = "http://localhost:8283/api"; //

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Required for the userEmail cookie
});