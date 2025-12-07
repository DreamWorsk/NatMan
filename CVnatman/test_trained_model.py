# test_trained_model.py
import tensorflow as tf
import numpy as np
from PIL import Image
import os
import json

class StatueClassifier:
    def __init__(self):
        # Загружаем модель
        self.model = tf.keras.models.load_model('statue_recognition_model.h5')
        self.img_size = (224, 224)
        
        # Русские названия классов
        self.russian_names = {
            'perun': 'Перун',
            'veles': 'Велес'
        }
        
        self.class_names = ['perun', 'veles']
    
    def predict_image(self, image_path):
        """Распознает статую на изображении"""
        try:
            print(f"🔍 Анализируем: {image_path}")
            
            # Загрузка и предобработка изображения
            with Image.open(image_path) as img:
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                img = img.resize(self.img_size)
                img_array = np.array(img, dtype='float32') / 255.0
            
            # Предсказание
            prediction = self.model.predict(np.array([img_array]), verbose=0)
            
            # Получаем результаты для всех классов
            results = []
            for i, class_name in enumerate(self.class_names):
                confidence = prediction[0][i]
                results.append({
                    'class': class_name,
                    'russian_name': self.russian_names[class_name],
                    'confidence': float(confidence)
                })
            
            # Сортируем по уверенности
            results.sort(key=lambda x: x['confidence'], reverse=True)
            
            return {
                'success': True,
                'top_prediction': results[0],
                'all_predictions': results
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

def main():
    if not os.path.exists('statue_recognition_model.h5'):
        print("❌ Модель не найдена. Сначала обучите модель.")
        return
    
    classifier = StatueClassifier()
    
    print("🎯 Модель готова к тестированию!")
    print("📷 Положите тестовое изображение в папку и введите его название")
    
    while True:
        print("\n" + "="*50)
        image_name = input("Введите название файла (например: test.jpg) или 'quit' для выхода: ").strip()
        
        if image_name.lower() == 'quit':
            break
        
        if not image_name:
            continue
            
        # Пробуем разные пути
        possible_paths = [
            image_name,
            os.path.join('statue_dataset', 'perun', image_name),
            os.path.join('statue_dataset', 'veles', image_name),
            os.path.join('test_images', image_name)
        ]
        
        image_path = None
        for path in possible_paths:
            if os.path.exists(path):
                image_path = path
                break
        
        if image_path and os.path.exists(image_path):
            result = classifier.predict_image(image_path)
            
            if result['success']:
                top = result['top_prediction']
                print(f"\n🎯 Результат: {top['russian_name']}")
                print(f"📊 Уверенность: {top['confidence']:.2%}")
                
                print("\n📈 Все предсказания:")
                for pred in result['all_predictions']:
                    print(f"   - {pred['russian_name']}: {pred['confidence']:.2%}")
            else:
                print(f"❌ Ошибка: {result['error']}")
        else:
            print("❌ Файл не найден. Попробуйте еще раз.")
            print("💡 Доступные файлы в текущей директории:")
            for file in os.listdir('.'):
                if file.lower().endswith(('.jpg', '.png', '.jpeg')):
                    print(f"   - {file}")

if __name__ == "__main__":
    main()