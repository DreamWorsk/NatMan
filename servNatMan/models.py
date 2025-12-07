from pydantic import BaseModel
from typing import Optional, List

class UserCreate(BaseModel):
    username: str
    password: str  
    first_name: str
    surname: str
    age: int
    mail: str
    phone_number: str

class UserResponse(BaseModel):
    id: int
    username: str
    first_name: str
    surname: str
    age: int
    mail: str
    phone_number: str

class TeamCreate(BaseModel):
    team_name: str

class TeamResponse(BaseModel):
    id: int
    team_name: str

class MarkCreate(BaseModel):
    user_id: int
    longitude: float
    latitude: float
    mark_name: str

class MarkResponse(BaseModel):
    id: int
    user_id: int
    longitude: float
    latitude: float
    mark_name: str

class GameCreate(BaseModel):
    start_time: str
    end_time: Optional[str] = None
    id_region: Optional[int] = None

class GameResponse(BaseModel):
    id: int
    start_time: str
    end_time: Optional[str]
    id_region: Optional[int]

class RegionCreate(BaseModel):
    country: str
    city: str
    street: Optional[str] = None

class RegionResponse(BaseModel):
    id: int
    country: str
    city: str
    street: Optional[str]

class TaskCreate(BaseModel):
    description: str
    reward: int = 100

class TaskResponse(BaseModel):
    id: int
    description: str
    reward: int

class UserLogin(BaseModel):
    username: str
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    username: str
    first_name: str  # ← ДОБАВЬТЕ
    surname: str     # ← ДОБАВЬТЕ
    role: str

class RoleResponse(BaseModel):
    id: int
    role_name: str
class RecognitionRequest(BaseModel):
    image: str  # base64 encoded image

class RecognizedObject(BaseModel):
    name: str
    confidence: float
    description: str
    interesting_fact: str

class RecognitionResponse(BaseModel):
    success: bool
    objects: List[RecognizedObject] = []
    error: Optional[str] = None
from pydantic import BaseModel
from typing import List, Optional