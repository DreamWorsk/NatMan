import axios from "axios";

const API_URL = "http://217.114.14.77:8002/roles";

// Получить роли
export async function getRoles() {
    try {
        const response = await axios.get(API_URL);
        return response.data.roles;   // список ролей
    } catch (error) {
        console.error("Ошибка при получении ролей:", error);
        return null;
    }
}