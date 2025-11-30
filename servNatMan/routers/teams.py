from fastapi import APIRouter, HTTPException, Depends
import psycopg2
from database import get_db_connection
from models import TeamCreate, TeamResponse

router = APIRouter(prefix="/teams", tags=["teams"])

@router.get("/", response_model=dict)
async def get_teams(conn = Depends(get_db_connection)):
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM teams")
        teams = cur.fetchall()
    return {"teams": teams}

@router.post("/", response_model=dict)
async def create_team(team: TeamCreate, conn = Depends(get_db_connection)):
    with conn.cursor() as cur:
        try:
            cur.execute("""
                INSERT INTO teams (team_name) VALUES (%s) RETURNING id
            """, (team.team_name,))
            
            new_team_id = cur.fetchone()['id']
            conn.commit()
            return {"message": "Команда создана", "team_id": new_team_id}
            
        except psycopg2.IntegrityError:
            conn.rollback()
            raise HTTPException(status_code=400, detail="Команда с таким именем уже существует")
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")