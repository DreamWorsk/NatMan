from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBasicCredentials
from fastapi.middleware.cors import CORSMiddleware
import secrets
import uvicorn

from database import create_tables, get_db_connection
from models import UserLogin, AuthResponse
from authorization import authenticate_user, security


from routers import users, teams, marks, games, regions, tasks, roles

app = FastAPI(title="NetMan")


app.include_router(users.router)
app.include_router(teams.router)
app.include_router(marks.router)
app.include_router(games.router)
app.include_router(regions.router)
app.include_router(tasks.router)
app.include_router(roles.router)

# Эндпоинты авторизации
@app.post("/auth/login", response_model=AuthResponse)
async def login(user_data: UserLogin, conn = Depends(get_db_connection)):
    user = authenticate_user(user_data.username, user_data.password, conn)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль",
        )
    
    access_token = secrets.token_hex(32)
    
    return AuthResponse(
        access_token=access_token,
        user_id=user['id'],
        username=user['username'],
        first_name=user['first_name'],  # ← ДОБАВЬТЕ
        surname=user['surname'],        # ← ДОБАВЬТЕ
        role=user['role']
    )

@app.get("/auth/me")
async def get_current_user(credentials: HTTPBasicCredentials = Depends(security)):
    return {"message": "Информация о пользователе", "username": credentials.username}

@app.on_event("startup")
async def startup_event():
    create_tables()

@app.get("/")
async def root():
    return {"message": "NetMan API", "version": "1.0.0"}

# Добавьте после создания app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Для разработки
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)  # ← 0.0.0.0 вместо 127.0.0.1