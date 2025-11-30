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
      
      // Разделяем полное имя на first_name и surname
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const surname = nameParts.slice(1).join(' ') || 'User';
      
      // Подготовка данных для регистрации
      const userData = {
        username: email, // Используем email как username
        password: password,
        first_name: firstName,
        surname: surname,
        age: 25, // Можно добавить поле для возраста позже
        mail: email,
        phone_number: "+79990000000" // Можно добавить поле для телефона позже
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
        <Text style={globalStyles.title}>Create Account</Text>
        <Text style={globalStyles.subtitle}>Sign up to get started</Text>
        
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