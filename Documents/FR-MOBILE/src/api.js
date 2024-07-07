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

export const getAllReseñas = async () => {
    try {
        const response = await fetch(`${API_URL}/reseñas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching reseñas:', error);
        throw error;
    }
};

export const createReseña = async (reseñaData) => {
    try {
        const response = await fetch(`${API_URL}/reseñas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reseñaData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating reseña:', error);
        throw error;
    }
};



