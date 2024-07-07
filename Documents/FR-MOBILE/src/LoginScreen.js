import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { login } from './Api';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email.includes('@') || password.length < 8) {
            setError('Correo electrónico inválido o contraseña incorrecta');
            sendNotification('Login Failed', 'Correo electrónico inválido o contraseña incorrecta');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const data = await login(email, password);
            if (data.token) {
                await SecureStore.setItemAsync('userToken', data.token);
                sendNotification('Login Success', 'Inicio de sesión exitoso');
                navigation.navigate('Home');
            } else {
                setError('Inicio de sesión fallido');
                sendNotification('Login Failed', 'Inicio de sesión fallido');
            }
        } catch (error) {
            setError('Ocurrió un error. Por favor intenta de nuevo.');
            sendNotification('Login Failed', 'Ocurrió un error. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const sendNotification = async (title, body) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
            },
            trigger: null,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Correo Electrónico:</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <Text style={styles.label}>Contraseña:</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Iniciar Sesión" onPress={handleLogin} />
            )}
            <Button
                title="Registrar"
                onPress={() => navigation.navigate('Register')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16 },
    label: { fontSize: 16, marginVertical: 8 },
    input: { borderWidth: 1, padding: 8, marginVertical: 8 },
    error: { color: 'red', marginBottom: 16 }
});

