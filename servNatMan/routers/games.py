from fastapi import APIRouter, HTTPException, Depends
import psycopg2
from database import get_db_connection
from models import GameCreate, GameResponse

router = APIRouter(prefix="/games", tags=["games"])

@router.get("/", response_model=dict)
async def get_games(conn = Depends(get_db_connection)):
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM games")
        games = cur.fetchall()
    return {"games": games}

@router.post("/", response_model=dict)
async def create_game(game: GameCreate, conn = Depends(get_db_connection)):
    with conn.cursor() as cur:
        try:
            cur.execute("""
                INSERT INTO games (start_time, end_time, id_region)
                VALUES (%s, %s, %s) RETURNING id
            """, (game.start_time, game.end_time, game.id_region))
            
            new_game_id = cur.fetchone()['id']
            conn.commit()
            return {"message": "Игра создана", "game_id": new_game_id}
            
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")