import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const register = async (userData: { username: string; password: string; email: string }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        return response.data;
    } catch (error: any) {
        console.error('Error during registration:', error);
        if (error.response && error.response.data) {
            throw error.response.data;
        }
        throw { code: 500, message: 'Registration failed. Please try again.', data: null };
    }
};


export const login = async (credentials: { username: string; password: string }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
        return response.data;
    } catch (error: any) {
        console.error('Error during login:', error);
        if (error.response && error.response.data) {
            throw error.response.data;
        }
        throw { code: 500, message: 'Login failed. Please check your credentials.', data: null };
    }
};


export const logout = async () => {
   
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('profileComplete');
    localStorage.removeItem('userProfile');
    
   
    window.location.href = '/login';
    
    return { code: 200, message: 'Logged out successfully', data: null };
};