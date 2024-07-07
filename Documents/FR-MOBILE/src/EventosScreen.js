// EventoScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { createEvento, getAllEventos, deleteEvento } from './Api';

const EventoScreen = ({ restaurantId }) => {
    const [eventos, setEventos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [fecha, setFecha] = useState('');
    const [capacidad, setCapacidad] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEventos();
    }, []);

    const fetchEventos = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedEventos = await getAllEventos();
            setEventos(fetchedEventos);
        } catch (err) {
            console.error('Error fetching eventos:', err);
            setError('Failed to fetch eventos.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvento = async () => {
        if (!nombre || !fecha || !capacidad) {
            setError('Por favor, complete todos los campos.');
            return;
        }

        const eventoData = {
            nombre: nombre,
            fecha: fecha,
            capacidad: parseInt(capacidad),
            restaurante: { id: restaurantId },
        };

        setLoading(true);
        setError(null);
        try {
            await createEvento(eventoData);
            setNombre('');
            setFecha('');
            setCapacidad('');
            fetchEventos();  // Vuelve a cargar los eventos después de crear uno nuevo
        } catch (err) {
            console.error('Error creating evento:', err);
            setError('Failed to create evento.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvento = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteEvento(id);
            fetchEventos();  // Vuelve a cargar los eventos después de eliminar uno
        } catch (err) {
            console.error('Error deleting evento:', err);
            setError('Failed to delete evento.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Nombre del Evento"
                value={nombre}
                onChangeText={setNombre}
                style={styles.input}
            />
            <TextInput
                placeholder="Fecha del Evento (YYYY-MM-DD)"
                value={fecha}
                onChangeText={setFecha}
                style={styles.input}
            />
            <TextInput
                placeholder="Capacidad"
                value={capacidad}
                onChangeText={setCapacidad}
                keyboardType="numeric"
                style={styles.input}
            />
            <Button title="Crear Evento" onPress={handleCreateEvento} />
            {error && <Text style={styles.error}>{error}</Text>}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={eventos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.eventoItem}>
                            <Text style={styles.nombre}>Nombre: {item.nombre}</Text>
                            <Text style={styles.fecha}>Fecha: {item.fecha}</Text>
                            <Text style={styles.capacidad}>Capacidad: {item.capacidad}</Text>
                            <Button title="Eliminar" onPress={() => handleDeleteEvento(item.id)} />
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
    eventoItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
    },
    nombre: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    fecha: {
        fontSize: 14,
    },
    capacidad: {
        fontSize: 14,
    },
});

export default EventoScreen;
