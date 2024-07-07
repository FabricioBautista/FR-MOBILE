import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { createReserva, updateReserva, deleteReserva, getAllReservas } from './Api';

const ReservaScreen = ({ userId, restaurantId }) => {
    const [reservas, setReservas] = useState([]);
    const [fechaHora, setFechaHora] = useState('');
    const [estado, setEstado] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReservas();
    }, []);

    const fetchReservas = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedReservas = await getAllReservas(restaurantId);
            setReservas(fetchedReservas);
        } catch (err) {
            console.error('Error fetching reservas:', err);
            setError('Failed to fetch reservas.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateReserva = async () => {
        if (!fechaHora || !estado) {
            setError('Por favor, complete todos los campos.');
            return;
        }

        const reservaData = {
            usuario: { id: userId },
            restaurante: { id: restaurantId },
            fechaHora: fechaHora,
            estado: estado,
        };

        setLoading(true);
        setError(null);
        try {
            await createReserva(reservaData);
            setFechaHora('');
            setEstado('');
            fetchReservas();  // Vuelve a cargar las reservas después de crear una nueva
        } catch (err) {
            console.error('Error creating reserva:', err);
            setError('Failed to create reserva.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReserva = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteReserva(id);
            fetchReservas();  // Vuelve a cargar las reservas después de eliminar una
        } catch (err) {
            console.error('Error deleting reserva:', err);
            setError('Failed to delete reserva.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Fecha y Hora"
                value={fechaHora}
                onChangeText={setFechaHora}
                style={styles.input}
            />
            <TextInput
                placeholder="Estado"
                value={estado}
                onChangeText={setEstado}
                style={styles.input}
            />
            <Button title="Crear Reserva" onPress={handleCreateReserva} />
            {error && <Text style={styles.error}>{error}</Text>}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={reservas}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.reservaItem}>
                            <Text style={styles.fechaHora}>Fecha y Hora: {item.fechaHora}</Text>
                            <Text style={styles.estado}>Estado: {item.estado}</Text>
                            <Button title="Eliminar" onPress={() => handleDeleteReserva(item.id)} />
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        borderWidth: 1,
        padding: 8,
        marginBottom: 16,
    },
    error: {
        color: 'red',
        marginBottom: 16,
    },
    reservaItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
    },
    fechaHora: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    estado: {
        fontSize: 14,
    },
});

export default ReservaScreen;

