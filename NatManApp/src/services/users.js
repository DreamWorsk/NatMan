import axios from "axios";

const API_URL = "http://217.114.14.77:8002/users";

// Получить всех пользователей
export async function getUsers() {
    try {
        const response = await axios.get(API_URL);
        return response.data.users;  // массив пользователей
    } catch (error) {
        console.error("Ошибка при получении пользователей:", error);
        return null;
    }
}

// Создать нового пользователя
export async function createUser(user) {
    try {
        const response = await axios.post(API_URL, user);
        return response.data;
    } catch (error) {
        console.error("Ошибка при создании пользователя:", error);
        return null;
    }
}
