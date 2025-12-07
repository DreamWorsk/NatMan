import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = 'http://217.114.14.77:8002';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color="#666" />
          <Text style={styles.permissionTitle}>Доступ к камере</Text>
          <Text style={styles.permissionText}>
            Для работы с распознаванием объектов необходимо разрешить доступ к камере
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Разрешить доступ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    setLoading(true);
    try {
      console.log('📸 Making photo...');
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
        exif: false
      });

      console.log('✅ Photo taken, sending to server...');
      await sendToServerForRecognition(photo);

    } catch (error) {
      console.log('❌ Error taking picture:', error);
      Alert.alert('Ошибка', 'Не удалось сделать фото');
      setLoading(false);
    }
  };

  const sendToServerForRecognition = async (photo) => {
    try {
      console.log('🔄 Sending to server without auth...');

      const response = await fetch(`${API_BASE_URL}/statues/recognize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: photo.base64,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Server error response:', errorText);
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const result = await response.json();
      console.log('🎯 Recognition result:', result);
      
      showRecognitionResult(result);

    } catch (error) {
      console.log('❌ Server recognition error:', error);
      
      if (error.message.includes('Network request failed')) {
        Alert.alert(
          'Сервер недоступен',
          'Не удалось подключиться к серверу распознавания. Показываем демо-результат.',
          [{ text: 'OK', onPress: () => showDemoResult() }]
        );
      } else {
        Alert.alert('Ошибка распознавания', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const showRecognitionResult = (result) => {
    if (result.success && result.objects && result.objects.length > 0) {
      const detectedObject = result.objects[0];
      
      Alert.alert(
        `🎯 Распознано: ${detectedObject.name}`,
        `${detectedObject.description}\n\n` +
        `Уверенность: ${Math.round(detectedObject.confidence * 100)}%\n\n` +
        `📖 ${detectedObject.interesting_fact}`,
        [
          { text: 'Закрыть', style: 'cancel' },
          { text: 'Узнать больше', onPress: () => showMoreInfo(detectedObject) }
        ]
      );
    } else {
      Alert.alert(
        'Не удалось распознать',
        result.error || 'Попробуйте сделать фото другого объекта или приблизиться',
        [{ text: 'OK' }]
      );
    }
  };

  const showDemoResult = () => {
    // Демо-результаты для славянских статуй
    const demoObjects = [
      {
        name: 'Перун',
        confidence: 0.92,
        description: 'Бог-громовержец, верховное божество славянского пантеона. Изображается с секирой или молотом.',
        interesting_fact: 'День Перуна отмечался 20 июля. Его символ - громовой знак, защищающий от злых сил.'
      },
      {
        name: 'Велес',
        confidence: 0.88,
        description: 'Бог скота, богатства и подземного мира. Покровительствует искусствам и торговле.',
        interesting_fact: 'Велес считался противником Перуна. Его день - 24 февраля, праздник скота.'
      },
      {
        name: 'Макошь',
        confidence: 0.85,
        description: 'Богиня плодородия, судьбы и ремёсел. Покровительница женщин и урожая.',
        interesting_fact: 'Мокошь - единственное женское божество в княжеском пантеоне Владимира.'
      }
    ];
    
    const randomObject = demoObjects[Math.floor(Math.random() * demoObjects.length)];
    showRecognitionResult({
      success: true,
      objects: [randomObject]
    });
  };

  const showMoreInfo = (object) => {
    Alert.alert(
      `Подробнее: ${object.name}`,
      'Здесь будет дополнительная информация об объекте. Функция в разработке.',
      [{ text: 'OK' }]
    );
  };

  // Функция для проверки состояния модели
  const checkModelStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/statues/health`);
      
      if (response.ok) {
        const status = await response.json();
        Alert.alert(
          'Статус модели',
          `Модель: ${status.model_loaded ? '✅ Загружена' : '❌ Не загружена'}\n` +
          `Классы: ${status.available_classes?.join(', ') || 'Недоступно'}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Ошибка', 'Не удалось проверить статус модели');
      }
    } catch (error) {
      console.log('❌ Error checking model status:', error);
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
    }
  };

  return (
    <View style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Распознавание статуй</Text>
        <TouchableOpacity onPress={checkModelStatus} style={styles.helpButton}>
          <Ionicons name="information-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Камера с абсолютным позиционированием */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          mode="picture"
        />
        
        {/* Оверлей элементы поверх камеры */}
        <View style={styles.cameraOverlay}>
          {/* Индикатор загрузки */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Анализируем изображение...</Text>
            </View>
          )}
          
          {/* Панель управления */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={[
                styles.captureButton, 
                loading && styles.captureButtonDisabled
              ]} 
              onPress={takePicture}
              disabled={loading}
            >
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Панель информации */}
      <View style={styles.infoPanel}>
        <Text style={styles.infoTitle}>Распознавание славянских статуй</Text>
        <Text style={styles.infoText}>
          1. Наведите камеру на статую{"\n"}
          2. Сделайте четкое фото{"\n"}
          3. Узнайте о славянском божестве
        </Text>
        
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Советы для лучшего распознавания:</Text>
          <Text style={styles.tip}>• Хорошее освещение</Text>
          <Text style={styles.tip}>• Четкий фокус на объекте</Text>
          <Text style={styles.tip}>• Заполните кадр статуей</Text>
          <Text style={styles.tip}>• Избегайте сильных бликов</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#000',
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpButton: {
    padding: 8,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  controlsContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoPanel: {
    backgroundColor: '#1c1c1e',
    padding: 20,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  tipsContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
  },
  tipsTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  tip: {
    color: '#ccc',
    fontSize: 12,
    lineHeight: 16,
  },
});