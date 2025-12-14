import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native';
import RegisterForm from '../components/RegisterForm'; // Assuming the path is similar to AuthForm
import { authService } from '../services/auth';
import { globalStyles } from '../styles/global'; // ← Импортируем общие стили
import { storeData } from '../utils/storage';

const RegisterScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (firstName, surname, age, phoneNumber, email, password) => {
    if (!firstName || !surname || !age || !phoneNumber || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const parsedAge = parseInt(age);
    if (isNaN(parsedAge)) {
      Alert.alert('Error', 'Age must be a valid number');
      return;
    }

    setLoading(true);
    try {
      console.log('Starting registration...'); // Для отладки
      
      const userData = {
        username: email,
        password: password,
        first_name: firstName,
        surname: surname,
        age: parsedAge,
        mail: email,
        phone_number: phoneNumber
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
      Alert.alert('Registration Error', error.message || 'An error occurred');
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
        <Text style={globalStyles.subtitle}>Зарегистрируйтесь чтобы начать</Text>
        
        <RegisterForm
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