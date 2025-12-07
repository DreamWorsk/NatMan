from fastapi import APIRouter, HTTPException, Depends
import psycopg2
from database import get_db_connection
from models import MarkCreate, MarkResponse

router = APIRouter(prefix="/marks", tags=["marks"])

@router.get("/", response_model=dict)
async def get_marks(conn = Depends(get_db_connection)):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT m.*, u.username as creator_username 
            FROM marks m 
            LEFT JOIN users u ON m.user_id = u.id 
            ORDER BY m.created_at DESC
        """)
        marks = cur.fetchall()
    return {"marks": marks}

@router.post("/", response_model=dict)
async def create_mark(mark: MarkCreate, conn = Depends(get_db_connection)):
    with conn.cursor() as cur:
        try:
            # Проверяем существование пользователя
            cur.execute("SELECT id FROM users WHERE id = %s", (mark.user_id,))
            if not cur.fetchone():
                raise HTTPException(status_code=400, detail="Пользователь не найден")
            
            cur.execute("""
                INSERT INTO marks (user_id, longitude, latitude, mark_name, description, address)
                VALUES (%s, %s, %s, %s, %s, %s) 
                RETURNING id, created_at, updated_at
            """, (
                mark.user_id, mark.longitude, mark.latitude, 
                mark.mark_name, mark.description, mark.address
            ))
            
            result = cur.fetchone()
            new_mark_id = result['id']
            conn.commit()
            
            return {
                "message": "Метка создана", 
                "mark_id": new_mark_id,
                "created_at": result['created_at'].isoformat(),
                "updated_at": result['updated_at'].isoformat()
            }
            
        except psycopg2.IntegrityError as e:
            conn.rollback()
            if "uq_coordinates" in str(e):
                raise HTTPException(status_code=400, detail="Метка с такими координатами уже существует")
            raise HTTPException(status_code=400, detail="Ошибка уникальности данных")
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")

@router.get("/{mark_id}", response_model=MarkResponse)
async def get_mark_by_id(mark_id: int, conn = Depends(get_db_connection)):
    """
    Получение конкретной метки по ID
    """
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM marks WHERE id = %s", (mark_id,))
        mark = cur.fetchone()
        
        if not mark:
            raise HTTPException(status_code=404, detail="Метка не найдена")
        
        return mark

@router.put("/{mark_id}", response_model=dict)
async def update_mark(
    mark_id: int, 
    mark_data: MarkCreate,  # Используем ту же модель
    conn = Depends(get_db_connection)
):
    """
    Обновление метки
    """
    with conn.cursor() as cur:
        try:
            # Проверяем существование метки
            cur.execute("SELECT id FROM marks WHERE id = %s", (mark_id,))
            if not cur.fetchone():
                raise HTTPException(status_code=404, detail="Метка не найдена")
            
            cur.execute("""
                UPDATE marks 
                SET user_id = %s, 
                    longitude = %s, 
                    latitude = %s, 
                    mark_name = %s, 
                    description = %s, 
                    address = %s,
                    updated_at = NOW()
                WHERE id = %s
                RETURNING id, updated_at
            """, (
                mark_data.user_id, mark_data.longitude, mark_data.latitude,
                mark_data.mark_name, mark_data.description, mark_data.address,
                mark_id
            ))
            
            result = cur.fetchone()
            conn.commit()
            
            return {
                "message": "Метка обновлена",
                "mark_id": result['id'],
                "updated_at": result['updated_at'].isoformat()
            }
            
        except psycopg2.IntegrityError as e:
            conn.rollback()
            if "uq_coordinates" in str(e):
                raise HTTPException(status_code=400, detail="Метка с такими координатами уже существует")
            raise HTTPException(status_code=400, detail="Ошибка уникальности данных")
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")

@router.delete("/{mark_id}", response_model=dict)
async def delete_mark(mark_id: int, conn = Depends(get_db_connection)):
    """
    Сделать метку неактивной
    """
    with conn.cursor() as cur:
        try:
            # Вместо удаления помечаем как неактивную
            cur.execute("""
                UPDATE marks 
                SET is_active = FALSE, updated_at = NOW()
                WHERE id = %s
                RETURNING id
            """, (mark_id,))
            
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Метка не найдена")
            
            conn.commit()
            return {"message": "Метка помечена как неактивная", "mark_id": mark_id}
            
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")
