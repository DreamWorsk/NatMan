from fastapi import APIRouter, HTTPException, Depends
import psycopg2
from database import get_db_connection
from models import RegionCreate, RegionResponse

router = APIRouter(prefix="/regions", tags=["regions"])

@router.get("/", response_model=dict)
async def get_regions(conn = Depends(get_db_connection)):
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM regions")
        regions = cur.fetchall()
    return {"regions": regions}

@router.post("/", response_model=dict)
async def create_region(region: RegionCreate, conn = Depends(get_db_connection)):
    with conn.cursor() as cur:
        try:
            cur.execute("""
                INSERT INTO regions (country, city, street)
                VALUES (%s, %s, %s) RETURNING id
            """, (region.country, region.city, region.street))
            
            new_region_id = cur.fetchone()['id']
            conn.commit()
            return {"message": "Регион создан", "region_id": new_region_id}
            
        except psycopg2.IntegrityError:
            conn.rollback()
            raise HTTPException(status_code=400, detail="Регион с такими данными уже существует")
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")