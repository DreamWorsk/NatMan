import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { removeData, getData } from '../utils/storage';
import { globalStyles } from '../styles/global';

const HomeScreen = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userData = await getData('userData');
    setUser(userData);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await removeData('userToken');
            await removeData('userData');
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  // Функции для навигации (пока заглушки)
  const navigateToCamera = () => {
    Alert.alert('Info', 'Camera screen will be implemented soon!');
    // router.push('/camera');
  };

  const navigateToTickets = () => {
    Alert.alert('Info', 'Tickets screen will be implemented soon!');
    // router.push('/tickets');
  };

  const navigateToProfile = () => {
    Alert.alert('Info', 'Profile screen will be implemented soon!');
    // router.push('/profile');
  };

  const navigateToMap = () => {
    Alert.alert('Info', 'Map screen will be implemented soon!');
    // router.push('/map');
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Заголовок и приветствие */}
        <View style={styles.header}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={globalStyles.logoLarge}
          />
          <Text style={styles.welcomeTitle}>Добро пожаловать в Лукоморье!</Text>
          {user && (
            <Text style={styles.userGreeting}>
              Привет, {user.first_name} {user.surname}!
            </Text>
          )}
        </View>

        {/* Основные функции */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Основные функции</Text>
          
          <View style={styles.gridContainer}>
            {/* Камера */}
            <TouchableOpacity style={styles.featureCard} onPress={navigateToCamera}>
              <View style={[styles.iconContainer, { backgroundColor: '#007AFF' }]}>
                <Ionicons name="camera" size={32} color="#fff" />
              </View>
              <Text style={styles.featureTitle}>Camera</Text>
              <Text style={styles.featureDescription}>
                Object detection and recognition
              </Text>
            </TouchableOpacity>

            {/* Карта */}
            <TouchableOpacity style={styles.featureCard} onPress={navigateToMap}>
              <View style={[styles.iconContainer, { backgroundColor: '#34C759' }]}>
                <Ionicons name="map" size={32} color="#fff" />
              </View>
              <Text style={styles.featureTitle}>Map</Text>
              <Text style={styles.featureDescription}>
                Geolocation and navigation
              </Text>
            </TouchableOpacity>

            {/* Билеты */}
            <TouchableOpacity style={styles.featureCard} onPress={navigateToTickets}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF9500' }]}>
                <Ionicons name="ticket" size={32} color="#fff" />
              </View>
              <Text style={styles.featureTitle}>Tickets</Text>
              <Text style={styles.featureDescription}>
                Purchase and manage tickets
              </Text>
            </TouchableOpacity>

            {/* Профиль */}
            <TouchableOpacity style={styles.featureCard} onPress={navigateToProfile}>
              <View style={[styles.iconContainer, { backgroundColor: '#AF52DE' }]}>
                <Ionicons name="person" size={32} color="#fff" />
              </View>
              <Text style={styles.featureTitle}>Profile</Text>
              <Text style={styles.featureDescription}>
                Your account and settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Дополнительная информация */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>About NatMan</Text>
          <Text style={styles.infoText}>
            NatMan helps you explore the world with advanced computer vision 
            and real-time object detection. Perfect for outdoor adventures 
            and urban exploration.
          </Text>
        </View>
      </ScrollView>

      {/* Кнопка выхода внизу */}
      <View style={styles.footer}>
        <TouchableOpacity style={globalStyles.logoutButton} onPress={handleLogout}>
          <Text style={globalStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Новые стили для домашнего экрана
const styles = {
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  userGreeting: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%', // 2 колонки с небольшим отступом
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  infoSection: {
    marginBottom: 40,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
};

export default HomeScreen;