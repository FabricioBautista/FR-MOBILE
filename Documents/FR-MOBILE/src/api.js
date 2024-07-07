import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.1.49:8080';

async function saveToken(token) {
    await SecureStore.setItemAsync('userToken', token);
}

async function getToken() {
    return await SecureStore.getItemAsync('userToken');
}

// Función para el login
export async function login(email, password) {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        const { token } = response.data;
        await saveToken(token);
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
}

// Función para el registro
export async function register(userData) {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        const { token } = response.data;
        await saveToken(token);
        return response.data;
    } catch (error) {
        throw new Error('Registration failed');
    }
}

// Añadir token a las peticiones
async function createAuthHeaders() {
    const token = await getToken();
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
}

// Funciones para la gestión de reseñas
export async function getAllReseñas() {
    try {
        const headers = await createAuthHeaders();
        const response = await axios.get(`${API_URL}/reseñas`, headers);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch reseñas');
    }
}

export async function createReseña(reseñaData) {
    try {
        const headers = await createAuthHeaders();
        const response = await axios.post(`${API_URL}/reseñas`, reseñaData, headers);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create reseña');
    }
}

// Funciones para la gestión de promociones
export async function getAllPromociones() {
    try {
        const headers = await createAuthHeaders();
        const response = await axios.get(`${API_URL}/promociones`, headers);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch promociones');
    }
}

export async function createPromocion(promocionData) {
    try {
        const headers = await createAuthHeaders();
        const response = await axios.post(`${API_URL}/promociones`, promocionData, headers);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create promocion');
    }
}

// Funciones para la gestión de reservas
export async function getAllReservas() {
    try {
        const headers = await createAuthHeaders();
        const response = await axios.get(`${API_URL}/reservas`, headers);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch reservas');
    }
}

export async function createReserva(reservaData) {
    try {
        const headers = await createAuthHeaders();
        const response = await axios.post(`${API_URL}/reservas`, reservaData, headers);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create reserva');
    }
}

// Funciones para la gestión de ubicaciones
export async function getAllUbicaciones() {
    try {
        const headers = await createAuthHeaders();
        const response = await axios.get(`${API_URL}/ubicaciones`, headers);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch ubicaciones');
    }
}

export async function createUbicacion(ubicacionData) {
    try {
        const headers = await createAuthHeaders();
        const response = await axios.post(`${API_URL}/ubicaciones`, ubicacionData, headers);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create ubicacion');
    }
}

// Funciones para la gestión de eventos
export async function getAllEventos() {
    try {
        const headers = await createAuthHeaders();
        const response = await axios.get(`${API_URL}/eventos`, headers);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch eventos');
    }
}

export async function createEvento(eventoData) {
    try {
        const headers = await createAuthHeaders();
        const response = await axios.post(`${API_URL}/eventos`, eventoData, headers);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create evento');
    }
}
