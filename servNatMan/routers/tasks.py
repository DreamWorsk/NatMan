from fastapi import APIRouter, HTTPException, Depends
import psycopg2
from database import get_db_connection
from models import TaskCreate, TaskResponse

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/", response_model=dict)
async def get_tasks(conn = Depends(get_db_connection)):
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM tasks")
        tasks = cur.fetchall()
    return {"tasks": tasks}

@router.post("/", response_model=dict)
async def create_task(task: TaskCreate, conn = Depends(get_db_connection)):
    with conn.cursor() as cur:
        try:
            cur.execute("""
                INSERT INTO tasks (description, reward)
                VALUES (%s, %s) RETURNING id
            """, (task.description, task.reward))
            
            new_task_id = cur.fetchone()['id']
            conn.commit()
            return {"message": "Задача создана", "task_id": new_task_id}
            
        except psycopg2.IntegrityError:
            conn.rollback()
            raise HTTPException(status_code=400, detail="Задача с таким описанием уже существует")
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")