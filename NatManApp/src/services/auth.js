import axios from 'axios';
const API_BASE_URL = 'http://217.114.14.77:8002';

export const authService = {
  async login(username, password) {
    try {
      console.log('🔐 LOGIN DEBUG START ==========');
      console.log('URL:', `${API_BASE_URL}/auth/login`);
      console.log('Data:', { username, password });
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
      }, {
        timeout: 10000, // 10 секунд таймаут
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('✅ LOGIN SUCCESS:', response.data);
      return {
        success: true,
        token: response.data.access_token,
        user: {
          id: response.data.user_id,
          username: response.data.username,
          first_name: response.data.first_name,
          surname: response.data.surname,
          role: response.data.role
        },
        message: "Login successful"
      };
    } catch (error) {
      console.log('❌ LOGIN FAILED:');
      console.log('Error name:', error.name);
      console.log('Error message:', error.message);
      console.log('Error code:', error.code);
      console.log('Is AxiosError?', error.isAxiosError);
      
      if (error.response) {
        console.log('Response status:', error.response.status);
        console.log('Response data:', error.response.data);
        console.log('Response headers:', error.response.headers);
      } else if (error.request) {
        console.log('No response received. Request was made but no response.');
        console.log('Request:', error.request);
      }
      
      console.log('Full error object:', JSON.stringify(error, null, 2));
      
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      } else {
        throw new Error('Network error or server is down');
      }
    }
  },

  async register(userData) {
    try {
      console.log('📝 REGISTER DEBUG START ==========');
      console.log('URL:', `${API_BASE_URL}/users/`);
      console.log('Full userData:', JSON.stringify(userData, null, 2));
      
      const response = await axios.post(`${API_BASE_URL}/users/`, userData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('✅ REGISTER SUCCESS:');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
      
      return {
        success: true,
        message: response.data.message,
        user_id: response.data.user_id
      };
    } catch (error) {
      console.log('❌ REGISTER FAILED:');
      console.log('Error name:', error.name);
      console.log('Error message:', error.message);
      console.log('Error code:', error.code);
      
      if (error.response) {
        console.log('Response status:', error.response.status);
        console.log('Response data:', error.response.data);
      } else if (error.request) {
        console.log('No response received - request was made but no response');
      }
      
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      } else {
        throw new Error('Network error or server is down');
      }
    }
  }
};