import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { createUbicacion, getAllUbicaciones, deleteUbicacion, searchPlaces } from './Api';

const UbicacionScreen = ({ restaurantId }) => {
    const [ubicaciones, setUbicaciones] = useState([]);
    const [direccion, setDireccion] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [pais, setPais] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUbicaciones();
    }, []);

    const fetchUbicaciones = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedUbicaciones = await getAllUbicaciones();
            setUbicaciones(fetchedUbicaciones);
        } catch (err) {
            console.error('Error fetching ubicaciones:', err);
            setError('Failed to fetch ubicaciones.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUbicacion = async () => {
        if (!direccion || !ciudad || !pais) {
            setError('Por favor, complete todos los campos.');
            return;
        }

        const ubicacionData = {
            direccion: direccion,
            ciudad: ciudad,
            pais: pais,
            restaurante: { id: restaurantId },
        };

        setLoading(true);
        setError(null);
        try {
            await createUbicacion(ubicacionData);
            setDireccion('');
            setCiudad('');
            setPais('');
            fetchUbicaciones();  // Vuelve a cargar las ubicaciones después de crear una nueva
        } catch (err) {
            console.error('Error creating ubicacion:', err);
            setError('Failed to create ubicacion.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchPlaces = async (query) => {
        setLoading(true);
        setError(null);
        try {
            const results = await searchPlaces(query);
            if (results.results.length > 0) {
                const place = results.results[0];
                setDireccion(place.formatted_address);
                setCiudad(place.address_components.find(comp => comp.types.includes('locality')).long_name);
                setPais(place.address_components.find(comp => comp.types.includes('country')).long_name);
            } else {
                setError('No se encontraron resultados.');
            }
        } catch (err) {
            console.error('Error searching places:', err);
            setError('Failed to search places.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUbicacion = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteUbicacion(id);
            fetchUbicaciones();  // Vuelve a cargar las ubicaciones después de eliminar una
        } catch (err) {
            console.error('Error deleting ubicacion:', err);
            setError('Failed to delete ubicacion.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Buscar Ubicación"
                onSubmitEditing={(e) => handleSearchPlaces(e.nativeEvent.text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Dirección"
                value={direccion}
                onChangeText={setDireccion}
                style={styles.input}
            />
            <TextInput
                placeholder="Ciudad"
                value={ciudad}
                onChangeText={setCiudad}
                style={styles.input}
            />
            <TextInput
                placeholder="País"
                value={pais}
                onChangeText={setPais}
                style={styles.input}
            />
            <Button title="Crear Ubicación" onPress={handleCreateUbicacion} />
            {error && <Text style={styles.error}>{error}</Text>}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={ubicaciones}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.ubicacionItem}>
                            <Text style={styles.direccion}>Dirección: {item.direccion}</Text>
                            <Text style={styles.ciudad}>Ciudad: {item.ciudad}</Text>
                            <Text style={styles.pais}>País: {item.pais}</Text>
                            <Button title="Eliminar" onPress={() => handleDeleteUbicacion(item.id)} />
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
    ubicacionItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
    },
    direccion: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    ciudad: {
        fontSize: 14,
    },
    pais: {
        fontSize: 14,
    },
});

export default UbicacionScreen;
