import tensorflow as tf
import numpy as np
import logging
from config import ModelConfig
from image_processor import ImageProcessor

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CVModel:
    def __init__(self, model_type='mobilenet_v2'):
        self.config = ModelConfig()
        self.image_processor = ImageProcessor(self.config.IMAGE_SIZE)
        self.model = None
        self.model_type = model_type
        self.load_model()
    
    def load_model(self):
        """Загрузка предобученной модели"""
        try:
            logger.info(f"🔄 Загрузка модели {self.model_type}...")
            
            if self.model_type == 'mobilenet_v2':
                self.model = tf.keras.applications.MobileNetV2(
                    weights='imagenet',
                    input_shape=self.config.INPUT_SHAPE
                )
            else:
                self.model = tf.keras.applications.MobileNetV2(
                    weights='imagenet',
                    input_shape=self.config.INPUT_SHAPE
                )
            
            logger.info(f"✅ Модель {self.model_type} загружена успешно!")
            
        except Exception as e:
            logger.error(f"❌ Ошибка загрузки модели: {e}")
            raise
    
    def predict_from_bytes(self, image_bytes):
        """Предсказание из bytes изображения"""
        try:
            # Предобработка изображения
            processed_image = self.image_processor.load_from_bytes(image_bytes)
            
            # Предсказание
            predictions = self.model.predict(processed_image, verbose=0)
            
            # Декодируем результаты используя встроенный декодер TensorFlow
            decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(
                predictions, 
                top=5  # Топ-5 предсказаний
            )
            
            # Форматируем результаты
            results = []
            for _, label, confidence in decoded_predictions[0]:
                results.append({
                    'class': label,
                    'confidence': float(confidence),
                    'class_id': None  # Можно добавить ID если нужно
                })
            
            return {
                'success': True,
                'predictions': results,
                'model_type': self.model_type,
                'total_predictions': len(results)
            }
            
        except Exception as e:
            logger.error(f"❌ Ошибка предсказания: {e}")
            return {
                'success': False,
                'error': str(e),
                'predictions': []
            }
    
    def predict_from_path(self, image_path):
        """Предсказание из пути к файлу"""
        try:
            # Предобработка изображения
            processed_image = self.image_processor.load_from_path(image_path)
            
            # Предсказание
            predictions = self.model.predict(processed_image, verbose=0)
            
            # Декодируем результаты используя встроенный декодер TensorFlow
            decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(
                predictions, 
                top=5  # Топ-5 предсказаний
            )
            
            # Форматируем результаты
            results = []
            for _, label, confidence in decoded_predictions[0]:
                results.append({
                    'class': label,
                    'confidence': float(confidence),
                    'class_id': None
                })
            
            return {
                'success': True,
                'predictions': results,
                'model_type': self.model_type,
                'total_predictions': len(results)
            }
            
        except Exception as e:
            logger.error(f"❌ Ошибка предсказания: {e}")
            return {
                'success': False,
                'error': str(e),
                'predictions': []
            }
    
    def get_model_info(self):
        """Информация о модели"""
        return {
            'model_type': self.model_type,
            'input_shape': self.config.INPUT_SHAPE,
            'confidence_threshold': self.config.CONFIDENCE_THRESHOLD
        }

# Создаем глобальный экземпляр для простоты использования
cv_model = CVModel()