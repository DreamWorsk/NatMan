// Заглушка для API - замените на реальные endpoints
const API_BASE_URL = 'localhost:8000';

export const authService = {
  async login(username, password) {
    try {
      console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
      });

      console.log('Login response:', response.data);

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
      console.log('Login error:', error.response?.data || error.message);
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      } else {
        throw new Error('Network error or server is down');
      }
    }
  },

  async register(userData) {
    try {
      console.log('Attempting registration to:', `${API_BASE_URL}/users/`);
      
      const response = await axios.post(`${API_BASE_URL}/users/`, userData);
      
      console.log('Registration response:', response.data);

      return {
        success: true,
        message: response.data.message,
        user_id: response.data.user_id
      };
    } catch (error) {
      console.log('Registration error:', error.response?.data || error.message);
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      } else {
        throw new Error('Network error or server is down');
      }
    }
  }
  
};
export const connectionTest = {
  async testConnection() {
    try {
      console.log('Testing connection to:', API_BASE_URL);
      const response = await axios.get(`${API_BASE_URL}/`);
      console.log('Connection test response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.log('Connection test failed:', error.message);
      return { 
        success: false, 
        error: error.message,
        details: error.response?.data 
      };
    }
  },

  async testUsersEndpoint() {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/`);
      console.log('Users endpoint test:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.log('Users endpoint test failed:', error.message);
      return { success: false, error: error.message };
    }
  }
};