import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { getAllReseñas, createReseña } from './api';

const ReviewScreen = () => {
    const [reseñas, setReseñas] = useState([]);
    const [valoracion, setValoracion] = useState('');
    const [comentario, setComentario] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReseñas();
    }, []);

    const fetchReseñas = async () => {
        try {
            const fetchedReseñas = await getAllReseñas();
            setReseñas(fetchedReseñas);
        } catch (err) {
            console.error('Error fetching reseñas:', err);
            setError('Failed to fetch reseñas.');
        }
    };

    const handleCreateReseña = async () => {
        if (!valoracion || !comentario) {
            setError('Please fill out all fields.');
            return;
        }

        const reseñaData = {
            usuario: { id: 1 },  // Reemplaza con el ID del usuario autenticado
            restaurante: { id: 1 },  // Reemplaza con el ID del restaurante seleccionado
            valoracion: parseInt(valoracion),
            comentario: comentario,
        };

        try {
            await createReseña(reseñaData);
            setValoracion('');
            setComentario('');
            fetchReseñas();  // Vuelve a cargar las reseñas después de crear una nueva
        } catch (err) {
            console.error('Error creating reseña:', err);
            setError('Failed to create reseña.');
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    error: {
        color: 'red',
        marginTop: 16,
    },
    reseñaItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
    },
    valoracion: {
        fontWeight: 'bold',
    },
    comentario: {
        fontStyle: 'italic',
    },
});

export default ReviewScreen;
