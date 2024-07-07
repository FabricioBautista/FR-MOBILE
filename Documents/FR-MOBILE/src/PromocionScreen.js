import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { createPromocion, getAllPromociones, deletePromocion } from './Api';

const PromocionScreen = ({ restaurantId }) => {
    const [promociones, setPromociones] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPromociones();
    }, []);

    const fetchPromociones = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedPromociones = await getAllPromociones();
            setPromociones(fetchedPromociones);
        } catch (err) {
            console.error('Error fetching promociones:', err);
            setError('Failed to fetch promociones.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePromocion = async () => {
        if (!descripcion || !fechaInicio || !fechaFin) {
            setError('Por favor, complete todos los campos.');
            return;
        }

        const promocionData = {
            descripcion: descripcion,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            restaurantes: [{ id: restaurantId }],
        };

        setLoading(true);
        setError(null);
        try {
            await createPromocion(promocionData);
            setDescripcion('');
            setFechaInicio('');
            setFechaFin('');
            fetchPromociones();  // Vuelve a cargar las promociones después de crear una nueva
        } catch (err) {
            console.error('Error creating promocion:', err);
            setError('Failed to create promocion.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePromocion = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deletePromocion(id);
            fetchPromociones();  // Vuelve a cargar las promociones después de eliminar una
        } catch (err) {
            console.error('Error deleting promocion:', err);
            setError('Failed to delete promocion.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Descripción"
                value={descripcion}
                onChangeText={setDescripcion}
                style={styles.input}
            />
            <TextInput
                placeholder="Fecha de Inicio (YYYY-MM-DD)"
                value={fechaInicio}
                onChangeText={setFechaInicio}
                style={styles.input}
            />
            <TextInput
                placeholder="Fecha de Fin (YYYY-MM-DD)"
                value={fechaFin}
                onChangeText={setFechaFin}
                style={styles.input}
            />
            <Button title="Crear Promoción" onPress={handleCreatePromocion} />
            {error && <Text style={styles.error}>{error}</Text>}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={promociones}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.promocionItem}>
                            <Text style={styles.descripcion}>Descripción: {item.descripcion}</Text>
                            <Text style={styles.fecha}>Fecha de Inicio: {item.fechaInicio}</Text>
                            <Text style={styles.fecha}>Fecha de Fin: {item.fechaFin}</Text>
                            <Button title="Eliminar" onPress={() => handleDeletePromocion(item.id)} />
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
    promocionItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
    },
    descripcion: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    fecha: {
        fontSize: 14,
    },
});

export default PromocionScreen;
