class ModelConfig:
    # Настройки модели
    IMAGE_SIZE = (224, 224)
    INPUT_SHAPE = (224, 224, 3)
    CONFIDENCE_THRESHOLD = 0.1  # Более низкий порог чтобы видеть больше результатов