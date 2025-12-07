from fastapi import APIRouter, HTTPException, UploadFile, File
import base64
import io
from statue_recognition import statue_recognizer
from models import RecognitionRequest, RecognitionResponse

router = APIRouter(prefix="/statues", tags=["statues"])

@router.get("/health")
async def statue_health_check():
    """Проверка состояния модуля распознавания статуй"""
    return {
        "model_loaded": statue_recognizer.is_loaded,
        "available_classes": list(statue_recognizer.russian_names.values()) if statue_recognizer.is_loaded else [],
        "status": "active" if statue_recognizer.is_loaded else "model_not_loaded"
    }

@router.post("/recognize", response_model=RecognitionResponse)
async def recognize_statue(request: RecognitionRequest):
    """Распознавание статуи по изображению в base64"""
    try:
        print("📨 Received statue recognition request")
        
        # Декодируем base64 изображение
        image_data = base64.b64decode(request.image)
        
        # Распознаем
        result = statue_recognizer.predict(image_data)
        
        print(f"✅ Recognition result: {result}")
        return RecognitionResponse(**result)
        
    except Exception as e:
        print(f"❌ Recognition error: {str(e)}")
        return RecognitionResponse(
            success=False,
            error=f"Ошибка обработки: {str(e)}"
        )

@router.post("/recognize-upload", response_model=RecognitionResponse)
async def recognize_statue_upload(file: UploadFile = File(...)):
    """Распознавание статуи по загруженному файлу"""
    try:
        print(f"📨 Received file upload: {file.filename}")
        
        # Читаем файл
        image_data = await file.read()
        
        # Распознаем
        result = statue_recognizer.predict(image_data)
        
        return RecognitionResponse(**result)
        
    except Exception as e:
        print(f"❌ File recognition error: {str(e)}")
        return RecognitionResponse(
            success=False,
            error=f"Ошибка обработки файла: {str(e)}"
        )

@router.get("/classes")
async def get_statue_classes():
    """Получить список распознаваемых классов"""
    if not statue_recognizer.is_loaded:
        raise HTTPException(status_code=503, detail="Модель не загружена")
    
    return {
        "classes": statue_recognizer.russian_names,
        "total": len(statue_recognizer.russian_names)
    }
