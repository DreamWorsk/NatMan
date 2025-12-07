import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { router } from 'expo-router';
import AuthForm from '../components/AuthForm';
import { authService } from '../services/auth';
import { storeData } from '../utils/storage';
import { globalStyles } from '../styles/global'; // ← Импортируем общие стили

const RegisterScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (email, password, name) => {
    setLoading(true);
    try {
      console.log('Starting registration...'); // Для отладки
      
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const surname = nameParts.slice(1).join(' ') || 'User';
      
       const userData = {
      username: email,
      password: password,
      first_name: firstName,
      surname: surname,
      age: 25,                    // ← ОБЯЗАТЕЛЬНОЕ поле
      mail: email,
      phone_number: "+7992340000" // ← ОБЯЗАТЕЛЬНОЕ поле
    };

      console.log('Sending registration data:', userData); // Для отладки

      // Шаг 1: Регистрация
      const registerResult = await authService.register(userData);
      console.log('Registration result:', registerResult); // Для отладки
      
      if (registerResult.success) {
        // Шаг 2: Автоматический логин после успешной регистрации
        console.log('Attempting auto-login...'); // Для отладки
        const loginResult = await authService.login(email, password);
        console.log('Login result:', loginResult); // Для отладки
        
        if (loginResult.success) {
          // Сохраняем токен и данные пользователя
          await storeData('userToken', loginResult.token);
          await storeData('userData', loginResult.user);
          
          Alert.alert('Success', 'Registration successful!');
          router.replace('/(tabs)');
        } else {
          Alert.alert('Success', 'Registration successful! Please login manually.');
          router.replace('/auth/login');
        }
      }
    } catch (error) {
      console.log('Registration error:', error); // Для отладки
      Alert.alert('Registration Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={globalStyles.logo}
        />
        <Text style={globalStyles.title}>Регистрация</Text>
        <Text style={globalStyles.subtitle}>Зарегестрируйтесь чтобы начать</Text>
        
        <AuthForm
          type="register"
          onSubmit={handleRegister}
          loading={loading}
        />
        
        <TouchableOpacity
          style={globalStyles.linkButton}
          onPress={() => router.replace('/auth/login')}
        >
          <Text style={globalStyles.linkText}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;