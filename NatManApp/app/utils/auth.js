// utils/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    console.log('🔐 Retrieved auth token:', token ? `${token.substring(0, 20)}...` : 'null');
    return token;
  } catch (error) {
    console.log('❌ Error getting auth token:', error);
    return null;
  }
};

export const isAuthenticated = async () => {
  const token = await getAuthToken();
  return !!token;
};