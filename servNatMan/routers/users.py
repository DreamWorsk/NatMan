from fastapi import APIRouter, HTTPException, Depends
import psycopg2
from database import get_db_connection
from models import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=dict)
async def get_users(conn = Depends(get_db_connection)):
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM users")
        users = cur.fetchall()
    return {"users": users}

@router.post("/", response_model=dict)
async def create_user(user: UserCreate, conn = Depends(get_db_connection)):
    with conn.cursor() as cur:
        try:
            cur.execute("SELECT id FROM roles WHERE role_name = 'player'")
            role_result = cur.fetchone()
            if not role_result:
                raise HTTPException(status_code=500, detail="Роль 'player' не найдена")
            
            role_id = role_result['id']
            
            cur.execute("""
                INSERT INTO users (username, password, role_id, first_name, surname, age, mail, phone_number)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (user.username, user.password, role_id, user.first_name, 
                  user.surname, user.age, user.mail, user.phone_number))
            
            new_user_id = cur.fetchone()['id']
            conn.commit()
            return {"message": "Пользователь создан", "user_id": new_user_id}
            
        except psycopg2.IntegrityError:
            conn.rollback()
            raise HTTPException(status_code=400, detail="Пользователь с таким username/mail/phone уже существует")
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")