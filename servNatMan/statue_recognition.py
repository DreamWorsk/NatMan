# statue_recognition.py
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
import os
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

class StatueRecognizer:
    def __init__(self, model_dir: str = "../models"):
        self.model = None
        self.class_names = []
        self.russian_names = {}
        self.img_size = (224, 224)
        self.is_loaded = False
        self.model_dir = model_dir
        self.load_model()
    
    def load_model(self):
        """Загрузка модели и меток классов"""
        try:
            model_path = os.path.join(self.model_dir, 'statue_recognition_model.h5')
            class_names_path = os.path.join(self.model_dir, 'class_names.json')
            
            logger.info(f"🔍 Поиск модели по пути: {os.path.abspath(model_path)}")
            logger.info(f"🔍 Поиск классов по пути: {os.path.abspath(class_names_path)}")
            
            if not os.path.exists(model_path):
                logger.error("❌ Модель не найдена. Файл statue_recognition_model.h5 отсутствует.")
                return
            
            if not os.path.exists(class_names_path):
                logger.error("❌ Файл class_names.json не найден.")
                return
            
            logger.info("🔄 Загрузка модели распознавания статуй...")
            self.model = tf.keras.models.load_model(model_path)
            
            # Загружаем названия классов
            with open(class_names_path, 'r', encoding='utf-8') as f:
                self.russian_names = json.load(f)
            self.class_names = list(self.russian_names.keys())
            
            self.is_loaded = True
            logger.info(f"✅ Модель загружена. Классы: {list(self.russian_names.values())}")
            
        except Exception as e:
            logger.error(f"❌ Ошибка загрузки модели: {e}")
            self.is_loaded = False
    
    def preprocess_image(self, image_data: bytes) -> np.ndarray:
        """Предобработка изображения"""
        try:
            image = Image.open(io.BytesIO(image_data))
            
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            image = image.resize(self.img_size)
            image_array = np.array(image, dtype='float32') / 255.0
            
            return image_array
            
        except Exception as e:
            logger.error(f"❌ Ошибка обработки изображения: {e}")
            raise
    
    def predict(self, image_data: bytes) -> Dict:
        """Предсказание для изображения"""
        if not self.is_loaded:
            return {
                'success': False,
                'error': 'Модель не загружена. Проверьте наличие файлов модели в папке models.'
            }
        
        try:
            processed_image = self.preprocess_image(image_data)
            
            prediction = self.model.predict(
                np.array([processed_image]), 
                verbose=0
            )
            
            # Получаем топ предсказания
            top_indices = np.argsort(prediction[0])[::-1][:3]  # Топ-3
            results = []
            
            for idx in top_indices:
                if idx < len(self.class_names):
                    class_name = self.class_names[idx]
                    confidence = float(prediction[0][idx])
                    
                    # Добавляем описания для разных статуй
                    description = self.get_statue_description(class_name)
                    interesting_fact = self.get_interesting_fact(class_name)
                    
                    results.append({
                        'name': self.russian_names.get(class_name, class_name),
                        'confidence': confidence,
                        'description': description,
                        'interesting_fact': interesting_fact
                    })
            
            return {
                'success': True,
                'objects': results
            }
            
        except Exception as e:
            logger.error(f"❌ Ошибка предсказания: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_statue_description(self, class_name: str) -> str:
        """Возвращает описание статуи"""
        descriptions = {
            'perun': 'Бог-громовержец, верховное божество славянского пантеона. Изображается с секирой или молотом.',
            'veles': 'Бог скота, богатства и подземного мира. Покровительствует искусствам и торговле.',
            'mokosh': 'Богиня плодородия, судьбы и ремёсел. Покровительница женщин и урожая.',
            'dazhdbog': 'Бог солнца и податель благ. Сын Сварога, даритель света и тепла.',
            'svarog': 'Бог-кузнец, творец мира. Отец многих богов и создатель небесного свода.'
        }
        return descriptions.get(class_name, 'Славянское божество')
    
    def get_interesting_fact(self, class_name: str) -> str:
        """Возвращает интересный факт о статуе"""
        facts = {
            'perun': 'День Перуна отмечался 20 июля. Его символ - громовой знак, защищающий от злых сил.',
            'veles': 'Велес считался противником Перуна. Его день - 24 февраля, праздник скота.',
            'mokosh': 'Мокошь - единственное женское божество в княжеском пантеоне Владимира.',
            'dazhdbog': 'Даждьбог упоминается в "Слове о полку Игореве" как прародитель русских людей.',
            'svarog': 'Сварог научил людей ковать металл и создал первые законы семейной жизни.'
        }
        return facts.get(class_name, 'Важная часть славянской мифологии и культуры.')


# Глобальный экземпляр распознавателя
statue_recognizer = StatueRecognizer(model_dir="../models")