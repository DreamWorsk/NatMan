from cv_model import CVModel
import os

def test_fixed_model():
    print("🧪 Тестирование исправленной модели...")
    
    # Создаем экземпляр модели
    model = CVModel()
    
    # Проверяем есть ли тестовое изображение
    if os.path.exists('test_image.jpg'):
        print("🔍 Анализируем test_image.jpg...")
        result = model.predict_from_path('test_image.jpg')
        
        if result['success']:
            print(f"✅ Успешно распознано объектов: {result['total_predictions']}")
            print("\n📋 Результаты:")
            for i, pred in enumerate(result['predictions']):
                print(f"   {i+1}. {pred['class']}: {pred['confidence']:.2%}")
        else:
            print(f"❌ Ошибка: {result['error']}")
    else:
        print("❌ test_image.jpg не найден")
        print("Создайте тестовое изображение или укажите путь к другому файлу")

if __name__ == "__main__":
    test_fixed_model()