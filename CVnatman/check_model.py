import tensorflow as tf
import numpy as np
from PIL import Image
import sys
import os

print("🔍 Проверка установки TensorFlow...")

try:
    # Проверяем TensorFlow
    print(f"✅ TensorFlow version: {tf.__version__}")
    
    # Проверяем Pillow (PIL)
    from PIL import Image
    print("✅ Pillow установлен")
    
    # Проверяем NumPy
    print(f"✅ NumPy version: {np.__version__}")
    
    # Пробуем загрузить модель
    print("🔄 Пробуем загрузить модель...")
    model = tf.keras.applications.MobileNetV2(weights='imagenet')
    print("✅ Модель загружена успешно!")
    
    print("\n🎉 Все работает! Можете продолжать тестирование.")
    
except Exception as e:
    print(f"❌ Ошибка: {e}")
    print("\n🔧 Попробуем пофиксить зависимости...")