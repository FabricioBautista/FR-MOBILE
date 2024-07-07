import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// api.js
const API_URL = 'http://127.0.0.1:8080';

export const register = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error in register function:', error);
        throw error;
    }
};



