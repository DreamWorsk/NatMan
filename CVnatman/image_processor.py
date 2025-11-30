import numpy as np
from PIL import Image
import io

class ImageProcessor:
    def __init__(self, target_size=(224, 224)):
        self.target_size = target_size
    
    def load_from_bytes(self, image_bytes):
        """Загрузка изображения из bytes"""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            return self.preprocess(image)
        except Exception as e:
            raise ValueError(f"Ошибка загрузки изображения: {str(e)}")
    
    def load_from_path(self, image_path):
        """Загрузка изображения из файла"""
        try:
            image = Image.open(image_path)
            return self.preprocess(image)
        except Exception as e:
            raise ValueError(f"Ошибка загрузки изображения: {str(e)}")
    
    def preprocess(self, image):
        """Предобработка изображения для модели"""
        # Конвертируем в RGB
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Изменяем размер
        image = image.resize(self.target_size)
        
        # Конвертируем в numpy array
        image_array = np.array(image, dtype=np.float32)
        
        # Нормализуем значения пикселей [0, 255] -> [0, 1]
        image_array = image_array / 255.0
        
        # Добавляем batch dimension
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array