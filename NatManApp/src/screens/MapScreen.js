import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const MapScreen = () => {
  const [region, setRegion] = useState({
    latitude: 55.7558,
    longitude: 37.6173,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const markers = [
    {
      id: 1,
      title: "Лукоморье - Главный вход",
      description: "Основной вход в парк",
      latitude: 55.7558,
      longitude: 37.6173,
    },
    {
      id: 2,
      title: "Аттракцион 'Мореход'",
      description: "Водный аттракцион для всей семьи",
      latitude: 55.7565,
      longitude: 37.6185,
    },
    {
      id: 3,
      title: "Кафе 'У Дуба'",
      description: "Место для отдыха и перекуса",
      latitude: 55.7548,
      longitude: 37.6162,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Карта Лукоморья</Text>
        <TouchableOpacity style={styles.locationButton}>
          <Ionicons name="navigate" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
            onPress={() => Alert.alert(marker.title, marker.description)}
          />
        ))}
      </MapView>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => Alert.alert('Навигация', 'Функция навигации будет доступна скоро')}
        >
          <Ionicons name="navigate-circle" size={24} color="#007AFF" />
          <Text style={styles.controlText}>Навигация</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => Alert.alert('Поиск', 'Поиск мест будет доступен скоро')}
        >
          <Ionicons name="search" size={24} color="#007AFF" />
          <Text style={styles.controlText}>Поиск</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => Alert.alert('Маршруты', 'Прокладка маршрутов будет доступна скоро')}
        >
          <Ionicons name="trail-sign" size={24} color="#007AFF" />
          <Text style={styles.controlText}>Маршруты</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationButton: {
    padding: 8,
  },
  map: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  controlButton: {
    alignItems: 'center',
    padding: 8,
  },
  controlText: {
    marginTop: 4,
    fontSize: 12,
    color: '#007AFF',
  },
});

export default MapScreen;