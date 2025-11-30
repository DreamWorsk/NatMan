from fastapi import APIRouter, Depends
from database import get_db_connection
from models import RoleResponse

router = APIRouter(prefix="/roles", tags=["roles"])

@router.get("/", response_model=dict)
async def get_roles(conn = Depends(get_db_connection)):
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM roles")
        roles = cur.fetchall()
    return {"roles": roles}