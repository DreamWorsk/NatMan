from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from typing import Optional
import secrets
from database import get_db_connection
from security import verify_password

security = HTTPBasic()

def authenticate_user(username: str, password: str, conn) -> Optional[dict]:
    with conn.cursor() as cur:
        cur.execute("""
            SELECT u.id, u.username, u.password, u.first_name, u.surname, r.role_name 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.username = %s
        """, (username,))
        user = cur.fetchone()
        
        if user and verify_password(password, user['password']):
            return {
                'id': user['id'],
                'username': user['username'],
                'first_name': user['first_name'],
                'surname': user['surname'],
                'role': user['role_name']
            }
    return None
