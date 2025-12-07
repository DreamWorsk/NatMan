# statue_model.py (дополнение)
import tensorflow as tf
from tensorflow import keras
import numpy as np
import os
from PIL import Image
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

class StatueRecognitionModel:
    def __init__(self, statue_classes):
        # Фильтруем классы, оставляя только те, у которых есть данные
        self.available_classes = self.get_available_classes(statue_classes)
        
        if len(self.available_classes) < 2:
            raise Exception(f"❌ Недостаточно классов для обучения. Найдено: {len(self.available_classes)}. Нужно минимум 2.")
            
        self.statue_classes = self.available_classes
        self.num_classes = len(self.statue_classes)
        self.model = None
        self.img_size = (224, 224)
        
        print(f"🎯 Модель будет обучена на {self.num_classes} классах: {self.statue_classes}")
        
    def get_available_classes(self, statue_classes):
        """Возвращает только классы, у которых есть изображения"""
        available = []
        for class_name in statue_classes:
            class_dir = os.path.join('statue_dataset', class_name)
            if os.path.exists(class_dir):
                images = [f for f in os.listdir(class_dir) if f.lower().endswith(('.jpg', '.png', '.jpeg'))]
                if len(images) > 0:
                    available.append(class_name)
                    print(f"   ✅ {class_name}: {len(images)} изображений")
                else:
                    print(f"   ❌ {class_name}: нет изображений")
            else:
                print(f"   ❌ {class_name}: папка не найдена")
        return available
        
    def prepare_dataset(self, data_dir):
        """Подготовка датасета"""
        images = []
        labels = []
        
        for class_idx, class_name in enumerate(self.statue_classes):
            class_dir = os.path.join(data_dir, class_name)
            
            print(f"📁 Загружаем изображения для: {class_name}")
            
            for img_file in os.listdir(class_dir):
                if img_file.lower().endswith(('.jpg', '.png', '.jpeg')):
                    img_path = os.path.join(class_dir, img_file)
                    img = self.preprocess_image(img_path)
                    
                    if img is not None:
                        images.append(img)
                        labels.append(class_idx)
        
        if len(images) == 0:
            raise Exception("❌ Не найдено изображений для обучения")
            
        print(f"✅ Итог: загружено {len(images)} изображений")
        return np.array(images), np.array(labels)
    
    def preprocess_image(self, img_path):
        """Предобработка изображения"""
        try:
            with Image.open(img_path) as img:
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                img = img.resize(self.img_size)
                img_array = np.array(img, dtype='float32') / 255.0
                return img_array
        except Exception as e:
            print(f"   ❌ Ошибка загрузки {img_path}: {e}")
            return None
    
    def build_model(self):
        """Создание модели для распознавания статуй"""
        base_model = tf.keras.applications.MobileNetV2(
            weights='imagenet',
            include_top=False,
            input_shape=(224, 224, 3)
        )
        
        base_model.trainable = False
        
        self.model = tf.keras.Sequential([
            base_model,
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(self.num_classes, activation='softmax')
        ])
        
        self.model.compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        print(f"✅ Модель создана для {self.num_classes} классов: {self.statue_classes}")
        return self.model
    
    def train(self, data_dir, epochs=20, validation_split=0.2):
        """Обучение модели"""
        print("📊 Подготовка данных...")
        X, y = self.prepare_dataset(data_dir)
        
        print(f"📈 Данные загружены: {len(X)} изображений")
        
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=validation_split, random_state=42, stratify=y
        )
        
        print("🔨 Создание модели...")
        self.build_model()
        
        checkpoint = tf.keras.callbacks.ModelCheckpoint(
            'best_statue_model.h5',
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        )
        
        early_stop = tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True
        )
        
        print("🎯 Начало обучения...")
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=16,
            callbacks=[checkpoint, early_stop],
            verbose=1
        )
        
        print("✅ Обучение завершено!")
        self.model.save('statue_recognition_model.h5')
        print("💾 Модель сохранена как 'statue_recognition_model.h5'")
        
        return history
    
    def predict(self, image_path):
        """Предсказание для нового изображения"""
        if self.model is None:
            if os.path.exists('statue_recognition_model.h5'):
                self.model = tf.keras.models.load_model('statue_recognition_model.h5')
            else:
                print("❌ Модель не обучена и не найдена!")
                return None
        
        img = self.preprocess_image(image_path)
        if img is None:
            return None
        
        prediction = self.model.predict(np.array([img]), verbose=0)
        class_idx = np.argmax(prediction[0])
        confidence = prediction[0][class_idx]
        
        return {
            'statue': self.statue_classes[class_idx],
            'confidence': float(confidence),
            'all_predictions': {
                self.statue_classes[i]: float(pred) 
                for i, pred in enumerate(prediction[0])
            }
        }