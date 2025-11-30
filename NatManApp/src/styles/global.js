import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  // Контейнеры
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },

  // Логотип
  logo: {
    width: 170,
    height: 170,
    marginBottom: 0,
    resizeMode: 'contain',
  },
  logoLarge: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },

  // Текст
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  userInfo: {
    fontSize: 18,
    marginBottom: 30,
    color: '#666',
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#444',
    marginBottom: 40,
  },

  // Формы
  input: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  // Кнопки
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Цветовая схема
// В раздел colors добавьте:
export const colors = {
  primary: '#007AFF',
  secondary: '#FF3B30',
  background: '#fff',
  text: '#333',
  textSecondary: '#666',
  border: '#ddd',
  inputBackground: '#f9f9f9',
  
  // Новые цвета для фич
  camera: '#007AFF',
  map: '#34C759',
  tickets: '#FF9500',
  profile: '#AF52DE',
};

// Размеры
export const sizes = {
  padding: 20,
  margin: 15,
  borderRadius: 8,
  logo: {
    small: 80,
    medium: 100,
    large: 120,
  },
};