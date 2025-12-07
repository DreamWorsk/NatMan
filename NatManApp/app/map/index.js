import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView // ← ДОБАВИЛИ ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ← ЗАМЕНИЛИ SafeAreaView
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile, Overlay } from 'react-native-maps';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const mapRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapType, setMapType] = useState('custom'); // 'custom' или 'osm'

  // Координаты для парка "Лукоморье" (примерные)
  const parkRegion = {
    latitude: 55.7558,
    longitude: 37.6173,
    latitudeDelta: 0.005, // Более близкий zoom для парка
    longitudeDelta: 0.005,
  };

  // Маркеры для парка "Лукоморье"
  const markers = [
    {
      id: 1,
      title: "Главный вход",
      description: "Основной вход в парк Лукоморье. Здесь начинается ваше путешествие!",
      type: "entrance",
      latitude: 55.7558,
      longitude: 37.6173,
    },
    {
      id: 2,
      title: "Аттракцион 'Мореход'",
      description: "Захватывающий водный аттракцион для всей семьи. Подходит для детей от 6 лет.",
      type: "attraction",
      latitude: 55.7562,
      longitude: 37.6178,
    },
    {
      id: 3,
      title: "Кафе 'У Дуба'",
      description: "Уютное кафе с домашней кухней. Попробуйте фирменный чай с травами!",
      type: "cafe",
      latitude: 55.7553,
      longitude: 37.6168,
    },
    {
      id: 4,
      title: "Великий Дуб",
      description: "Легендарный дуб из сказок Пушкина. Возраст более 200 лет.",
      type: "landmark",
      latitude: 55.7560,
      longitude: 37.6172,
    },
    {
      id: 5,
      title: "Озеро Русалочки",
      description: "Живописное озеро с фонтаном в виде русалки. Отличное место для фото.",
      type: "attraction",
      latitude: 55.7555,
      longitude: 37.6175,
    },
    {
      id: 6,
      title: "Детская площадка 'Богатыри'",
      description: "Безопасная игровая зона для детей с тематическими горками.",
      type: "playground",
      latitude: 55.7550,
      longitude: 37.6165,
    },
    {
      id: 7,
      title: "Сувенирная лавка",
      description: "Магазин с памятными подарками и сувенирами Лукоморья.",
      type: "shop",
      latitude: 55.7557,
      longitude: 37.6163,
    },
    {
      id: 8,
      title: "Сцена 'Лукоморье'",
      description: "Место проведения спектаклей и музыкальных представлений.",
      type: "entertainment",
      latitude: 55.7559,
      longitude: 37.6160,
    },
  ];

  const getMarkerIcon = (type) => {
    const icons = {
      'entrance': 'enter-outline',
      'attraction': 'star-outline',
      'cafe': 'restaurant-outline',
      'landmark': 'flag-outline',
      'playground': 'happy-outline',
      'shop': 'cart-outline',
      'entertainment': 'musical-notes-outline',
    };
    return icons[type] || 'location-outline';
  };

  const getMarkerColor = (type) => {
    const colors = {
      'entrance': '#007AFF',
      'attraction': '#FF9500',
      'cafe': '#FF3B30',
      'landmark': '#34C759',
      'playground': '#AF52DE',
      'shop': '#FF2D55',
      'entertainment': '#5856D6',
    };
    return colors[type] || '#8E8E93';
  };

  const getMarkerLabel = (type) => {
    const labels = {
      'entrance': 'Вход',
      'attraction': 'Аттракцион',
      'cafe': 'Кафе',
      'landmark': 'Достопримечательность',
      'playground': 'Детская площадка',
      'shop': 'Магазин',
      'entertainment': 'Развлечения',
    };
    return labels[type] || 'Объект';
  };

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
    Alert.alert(
      marker.title,
      `${marker.description}\n\nТип: ${getMarkerLabel(marker.type)}`,
      [
        { 
          text: 'Построить маршрут', 
          onPress: () => showDirections(marker) 
        },
        { 
          text: 'Подробнее', 
          onPress: () => showMoreInfo(marker) 
        },
        { 
          text: 'Закрыть', 
          style: 'cancel' 
        },
      ]
    );
  };

  const showDirections = (marker) => {
    Alert.alert(
      'Навигация',
      `Маршрут до "${marker.title}" будет построен. Следуйте указателям в парке.`,
      [{ text: 'OK' }]
    );
  };

  const showMoreInfo = (marker) => {
    const additionalInfo = {
      1: "Время работы: 9:00 - 22:00\nКассы работают до 20:00",
      2: "Высота ограничения: 120 см\nВремя аттракциона: 10 минут",
      3: "Кухня: русская, европейская\nСредний чек: 800 руб.",
      4: "Высота дерева: 25 метров\nОбхват ствола: 4.5 метра",
      5: "Глубина: 1.5 метра\nФонтан работает с 10:00 до 20:00",
      6: "Возраст: 3-12 лет\nВремя работы: 9:00 - 21:00",
      7: "Часы работы: 10:00 - 20:00\nПринимаем карты и наличные",
      8: "Расписание: среда-воскресенье\nНачало представлений: 12:00, 15:00, 18:00"
    };
    
    Alert.alert(
      `Подробнее: ${marker.title}`,
      additionalInfo[marker.id] || 'Информация будет дополнена',
      [{ text: 'OK' }]
    );
  };

  const focusOnUserLocation = () => {
    Alert.alert(
      'Ваше местоположение',
      'Для точного определения местоположения включите GPS и находитесь в парке.',
      [{ text: 'OK' }]
    );
  };

  const toggleMapType = () => {
    setMapType(prev => prev === 'custom' ? 'osm' : 'custom');
  };

  const showAllAttractions = () => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(markers, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  // Функция для отображения кастомной карты парка
  const renderCustomMap = () => {
    return (
      <>
        {/* Можно добавить Overlay с изображением карты парка */}
        {/* 
        <Overlay
          bounds={[
            [55.7545, 37.6160], // юго-запад
            [55.7565, 37.6185]  // северо-восток
          ]}
          image={require('../../assets/images/park-map.png')} // Добавь свое изображение
          opacity={0.7}
        />
        */}
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => handleMarkerPress(marker)}
          >
            <View style={[styles.markerContainer, { backgroundColor: getMarkerColor(marker.type) }]}>
              <Ionicons name={getMarkerIcon(marker.type)} size={20} color="#fff" />
            </View>
          </Marker>
        ))}
      </>
    );
  };

  // Функция для отображения OpenStreetMap
  const renderOSMMap = () => {
    return (
      <>
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => handleMarkerPress(marker)}
          >
            <View style={[styles.markerContainer, { backgroundColor: getMarkerColor(marker.type) }]}>
              <Ionicons name={getMarkerIcon(marker.type)} size={20} color="#fff" />
            </View>
          </Marker>
        ))}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mapType === 'custom' ? 'Карта Лукоморья' : 'OpenStreetMap'}
        </Text>
        <TouchableOpacity style={styles.mapTypeButton} onPress={toggleMapType}>
          <Ionicons 
            name={mapType === 'custom' ? 'map-outline' : 'navigate-outline'} 
            size={24} 
            color="#007AFF" 
          />
        </TouchableOpacity>
      </View>

      {/* Карта */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        region={parkRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
        rotateEnabled={false}
      >
        {mapType === 'custom' ? renderCustomMap() : renderOSMMap()}
      </MapView>

      {/* Легенда */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Обозначения:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.legendScroll}>
          <View style={styles.legendItems}>
            {Object.entries({
              'entrance': 'Вход',
              'attraction': 'Аттракцион',
              'cafe': 'Кафе',
              'landmark': 'Достопримечательность',
              'playground': 'Детская площадка',
              'shop': 'Магазин',
              'entertainment': 'Развлечения'
            }).map(([type, label]) => (
              <View key={type} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: getMarkerColor(type) }]} />
                <Text style={styles.legendText}>{label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Панель управления */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={focusOnUserLocation}
        >
          <Ionicons name="navigate" size={24} color="#007AFF" />
          <Text style={styles.controlText}>Мое местоположение</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={showAllAttractions}
        >
          <Ionicons name="eye" size={24} color="#007AFF" />
          <Text style={styles.controlText}>Показать все</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={toggleMapType}
        >
          <Ionicons 
            name={mapType === 'custom' ? 'earth' : 'map'} 
            size={24} 
            color="#007AFF" 
          />
          <Text style={styles.controlText}>
            {mapType === 'custom' ? 'OSM' : 'Схема'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Быстрые действия */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction} onPress={() => handleMarkerPress(markers[3])}>
          <Ionicons name="flag" size={16} color="#fff" />
          <Text style={styles.quickActionText}>К дубу</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction} onPress={() => handleMarkerPress(markers[1])}>
          <Ionicons name="boat" size={16} color="#fff" />
          <Text style={styles.quickActionText}>Мореход</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction} onPress={() => handleMarkerPress(markers[2])}>
          <Ionicons name="cafe" size={16} color="#fff" />
          <Text style={styles.quickActionText}>Кафе</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickAction} onPress={() => handleMarkerPress(markers[5])}>
          <Ionicons name="happy" size={16} color="#fff" />
          <Text style={styles.quickActionText}>Детям</Text>
        </TouchableOpacity>
      </View>

      {/* Информация о карте */}
      <View style={styles.mapInfo}>
        <Text style={styles.mapInfoText}>
          {mapType === 'custom' 
            ? 'Схематичная карта парка' 
            : 'Карта на основе OpenStreetMap'
          }
        </Text>
      </View>
    </SafeAreaView>
  );
}

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
  mapTypeButton: {
    padding: 8,
  },
  map: {
    width: '100%',
    height: '65%',
  },
  legend: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 100,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendScroll: {
    flexGrow: 0,
  },
  legendItems: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#fff',
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
    flex: 1,
  },
  controlText: {
    marginTop: 4,
    fontSize: 10,
    color: '#007AFF',
    textAlign: 'center',
  },
  quickActions: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    gap: 8,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  mapInfo: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  mapInfoText: {
    color: '#fff',
    fontSize: 10,
  },
});