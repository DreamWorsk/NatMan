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
import { globalStyles } from '../styles/global';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (username, password) => {
    setLoading(true);
    try {
      const result = await authService.login(username, password);
      
      if (result.success) {
        await storeData('userToken', 'authenticated');
        await storeData('userData', result.user);
        Alert.alert('Success', result.message);
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
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
        <Text style={globalStyles.title}>С возвращением!</Text>
        <Text style={globalStyles.subtitle}>Войдите в свой аккаунт</Text>
        
        <AuthForm
          type="login"
          onSubmit={handleLogin}
          loading={loading}
        />
        
        <TouchableOpacity
          style={globalStyles.linkButton}
          onPress={() => router.replace('/auth/register')}
        >
          <Text style={globalStyles.linkText}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;