import axios from "axios";

const API_URL = "http://217.114.14.77:8002/marks";

// Получить метки
export async function getMarks() {
    try {
        const response = await axios.get(API_URL);
        return response.data.marks;   // список меток
    } catch (error) {
        console.error("Ошибка при получении меток:", error);
        return null;
    }
}

// Создать метку
export async function createMark(userId, longitude, latitude, markName) {
    try {
        const response = await axios.post(API_URL, {
            user_id: userId,
            longitude: longitude,
            latitude: latitude,
            mark_name: markName
        });
        return response.data; 
    } catch (error) {
        console.error("Ошибка при создании метки:", error);
        return null;
    }
}