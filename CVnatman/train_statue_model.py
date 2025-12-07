# train_statue_model.py
from statue_model import StatueRecognitionModel
import os
import json

def setup_directories(statue_classes):
    """Создает структуру папок для каждого класса"""
    base_dir = 'statue_dataset'
    os.makedirs(base_dir, exist_ok=True)
    
    for class_name in statue_classes:
        class_dir = os.path.join(base_dir, class_name)
        os.makedirs(class_dir, exist_ok=True)
        print(f"📁 Создана папка: {class_dir}")
    
    print("\n📝 Добавьте изображения в соответствующие папки:")
    for class_name in statue_classes:
        print(f"   - {base_dir}/{class_name}/")

def create_class_names_file(statue_classes):
    """Создает файл с русскими названиями классов"""
    russian_names = {
        'perun': 'Перун',
        'veles': 'Велес', 
        'mokosh': 'Макошь',
        'dazhdbog': 'Даждьбог',
        'svarog': 'Сварог'
    }
    
    # Фильтруем только те классы, которые есть в текущем обучении
    filtered_names = {cls: russian_names[cls] for cls in statue_classes if cls in russian_names}
    
    with open('class_names.json', 'w', encoding='utf-8') as f:
        json.dump(filtered_names, f, ensure_ascii=False, indent=2)
    
    print("✅ class_names.json создан!")
    print("📋 Содержимое:", filtered_names)

def train_statue_model():
    """Обучение модели распознавания статуй"""
    
    statue_classes = ['perun', 'veles', 'mokosh', 'dazhdbog', 'svarog']
    
    if not os.path.exists('statue_dataset'):
        setup_directories(statue_classes)
        print("✅ Папки созданы. Добавьте изображения и запустите снова.")
        return
    
    # Проверяем какие классы действительно есть с изображениями
    available_classes = []
    for class_name in statue_classes:
        class_dir = os.path.join('statue_dataset', class_name)
        if os.path.exists(class_dir) and len(os.listdir(class_dir)) > 0:
            available_classes.append(class_name)
    
    if len(available_classes) < 2:
        print("❌ Недостаточно классов с изображениями для обучения.")
        print("💡 Нужно минимум 2 класса с изображениями.")
        return
    
    print(f"🎯 Будут обучены классы: {available_classes}")
    
    # Создаем и обучаем модель
    print("🏗️ Создание модели для распознавания статуй...")
    model = StatueRecognitionModel(available_classes)
    
    try:
        history = model.train('statue_dataset', epochs=25)
        if history:
            print("🎉 Модель успешно обучена!")
            
            # СОЗДАЕМ ФАЙЛ С НАЗВАНИЯМИ КЛАССОВ
            create_class_names_file(available_classes)
            
        else:
            print("❌ Обучение не удалось")
        
    except Exception as e:
        print(f"❌ Ошибка обучения: {e}")

if __name__ == "__main__":
    train_statue_model()