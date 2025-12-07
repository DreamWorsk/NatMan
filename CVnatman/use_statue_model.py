# use_statue_model.py
import tensorflow as tf
import numpy as np
from PIL import Image
import os
import json
import glob

class StatuePredictor:
    def __init__(self, model_path='statue_recognition_model.h5'):
        """Инициализация предсказателя"""
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"❌ Модель {model_path} не найдена!")
        
        print("🔄 Загрузка модели...")
        self.model = tf.keras.models.load_model(model_path)
        self.img_size = (224, 224)
        
        # Загружаем русские названия
        if os.path.exists('class_names.json'):
            with open('class_names.json', 'r', encoding='utf-8') as f:
                self.russian_names = json.load(f)
        else:
            # Создаем стандартные названия если файла нет
            self.russian_names = {
                'perun': 'Перун',
                'veles': 'Велес',
                'mokosh': 'Макошь',
                'dazhdbog': 'Даждьбог', 
                'svarog': 'Сварог'
            }
        
        self.class_names = list(self.russian_names.keys())
        print("✅ Модель загружена!")
        
        # Список папок для поиска изображений
        self.search_folders = [
            '.',  # Текущая папка
            'statue_dataset',
            'statue_dataset/perun',
            'statue_dataset/veles', 
            'statue_dataset/mokosh',
            'statue_dataset/dazhdbog',
            'statue_dataset/svarog',
            'test_images',
            'images'
        ]

    def find_image(self, image_name):
        """Находит изображение по имени в различных папках"""
        # Добавляем возможные расширения если их нет в названии
        if not any(image_name.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.bmp']):
            possible_names = [
                image_name,
                image_name + '.jpg',
                image_name + '.jpeg', 
                image_name + '.png',
                image_name + '.JPG',
                image_name + '.JPEG',
                image_name + '.PNG'
            ]
        else:
            possible_names = [image_name]
        
        # Ищем во всех папках
        for folder in self.search_folders:
            if not os.path.exists(folder):
                continue
                
            for name in possible_names:
                full_path = os.path.join(folder, name)
                if os.path.exists(full_path):
                    return full_path
        
        return None

    def list_available_images(self):
        """Показывает доступные изображения"""
        print("\n📁 Доступные изображения:")
        image_count = 0
        
        for folder in self.search_folders:
            if not os.path.exists(folder):
                continue
                
            images = []
            for ext in ['*.jpg', '*.jpeg', '*.png', '*.bmp']:
                images.extend(glob.glob(os.path.join(folder, ext)))
                images.extend(glob.glob(os.path.join(folder, ext.upper())))
            
            if images:
                print(f"  📂 {folder}/")
                for img in images[:5]:  # Показываем первые 5 в каждой папке
                    print(f"    - {os.path.basename(img)}")
                if len(images) > 5:
                    print(f"    ... и еще {len(images) - 5} изображений")
                image_count += len(images)
        
        if image_count == 0:
            print("  ❌ Изображения не найдены")
        else:
            print(f"\nВсего найдено: {image_count} изображений")
        
        return image_count

    def predict_statue(self, image_path):
        """Распознает статую на изображении с русскими названиями"""
        try:
            # Проверяем существует ли файл
            if not os.path.exists(image_path):
                return {'error': f'Файл {image_path} не найден'}
            
            print(f"🔍 Анализируем: {os.path.basename(image_path)}")
            
            # Загрузка и предобработка изображения
            with Image.open(image_path) as img:
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                img = img.resize(self.img_size)
                img_array = np.array(img, dtype='float32') / 255.0
            
            # Предсказание
            prediction = self.model.predict(np.array([img_array]), verbose=0)
            class_idx = np.argmax(prediction[0])
            confidence = prediction[0][class_idx]
            class_name = self.class_names[class_idx]
            
            # Формируем все предсказания
            all_predictions = {}
            for i, pred_class in enumerate(self.class_names):
                all_predictions[self.russian_names[pred_class]] = float(prediction[0][i])
            
            return {
                'statue_english': class_name,
                'statue_russian': self.russian_names[class_name],
                'confidence': float(confidence),
                'all_predictions': all_predictions
            }
        except Exception as e:
            return {'error': str(e)}

def main():
    """Основная функция для интерактивного использования"""
    try:
        predictor = StatuePredictor()
        
        print("\n🎯 Модель распознавания статуй готова к работе!")
        print("📷 Теперь можно вводить только название файла")
        print("   (введите 'list' чтобы увидеть все изображения)")
        print("   (введите 'quit' для выхода)\n")
        
        # Показываем доступные изображения при старте
        predictor.list_available_images()
        
        while True:
            user_input = input("\nВведите название изображения: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("👋 До свидания!")
                break
                
            if user_input.lower() == 'list':
                predictor.list_available_images()
                continue
                
            if not user_input:
                continue
            
            # Ищем изображение
            image_path = predictor.find_image(user_input)
            
            if not image_path:
                print(f"❌ Изображение '{user_input}' не найдено")
                print("💡 Попробуйте 'list' чтобы увидеть доступные изображения")
                continue
            
            result = predictor.predict_statue(image_path)
            
            if 'error' not in result:
                print(f"\n🎯 Результат: {result['statue_russian']}")
                print(f"📊 Уверенность: {result['confidence']:.2%}")
                
                print("\n📈 Все предсказания:")
                for statue, conf in result['all_predictions'].items():
                    print(f"   - {statue}: {conf:.2%}")
            else:
                print(f"❌ Ошибка обработки: {result['error']}")
            
    except FileNotFoundError as e:
        print(e)
        print("\n💡 Сначала обучите модель: python train_statue_model.py")
    except Exception as e:
        print(f"❌ Критическая ошибка: {e}")

if __name__ == "__main__":
    main()