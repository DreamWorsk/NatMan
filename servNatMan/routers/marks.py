from fastapi import APIRouter, HTTPException, Depends
import psycopg2
from database import get_db_connection
from models import MarkCreate, MarkResponse

router = APIRouter(prefix="/marks", tags=["marks"])

@router.get("/", response_model=dict)
async def get_marks(conn = Depends(get_db_connection)):
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM marks")
        marks = cur.fetchall()
    return {"marks": marks}

@router.post("/", response_model=dict)
async def create_mark(mark: MarkCreate, conn = Depends(get_db_connection)):
    with conn.cursor() as cur:
        try:
            cur.execute("""
                INSERT INTO marks (user_id, longitude, latitude, mark_name)
                VALUES (%s, %s, %s, %s) RETURNING id
            """, (mark.user_id, mark.longitude, mark.latitude, mark.mark_name))
            
            new_mark_id = cur.fetchone()['id']
            conn.commit()
            return {"message": "Метка создана", "mark_id": new_mark_id}
            
        except psycopg2.IntegrityError:
            conn.rollback()
            raise HTTPException(status_code=400, detail="Метка с таким именем или координатами уже существует")
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")