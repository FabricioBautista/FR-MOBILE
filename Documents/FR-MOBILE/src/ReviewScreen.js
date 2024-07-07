import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getAllReseñas, createReseña } from './Api';

const ReviewScreen = ({ userId, restaurantId }) => {
    const [reseñas, setReseñas] = useState([]);
    const [valoracion, setValoracion] = useState('');
    const [comentario, setComentario] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReseñas();
    }, []);

    const fetchReseñas = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedReseñas = await getAllReseñas(restaurantId);
            setReseñas(fetchedReseñas);
        } catch (err) {
            console.error('Error fetching reseñas:', err);
            setError('Failed to fetch reseñas.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateReseña = async () => {
        if (!valoracion || !comentario) {
            setError('Please fill out all fields.');
            return;
        }

        const reseñaData = {
            usuario: { id: userId },
            restaurante: { id: restaurantId },
            valoracion: parseInt(valoracion),
            comentario: comentario,
        };

        setLoading(true);
        setError(null);
        try {
            await createReseña(reseñaData);
            setValoracion('');
            setComentario('');
            fetchReseñas();  // Vuelve a cargar las reseñas después de crear una nueva
        } catch (err) {
            console.error('Error creating reseña:', err);
            setError('Failed to create reseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Valoración (1-5)"
                value={valoracion}
                onChangeText={setValoracion}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                placeholder="Comentario"
                value={comentario}
                onChangeText={setComentario}
                style={styles.input}
            />
            <Button title="Submit Review" onPress={handleCreateReseña} />
            {error && <Text style={styles.error}>{error}</Text>}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={reseñas}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.reseñaItem}>
                            <Text style={styles.valoracion}>Valoración: {item.valoracion}</Text>
                            <Text style={styles.comentario}>Comentario: {item.comentario}</Text>
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
    reseñaItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
    },
    valoracion: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    comentario: {
        fontSize: 14,
    },
});

export default ReviewScreen;
