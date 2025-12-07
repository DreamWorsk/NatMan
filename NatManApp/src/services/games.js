import axios from 'axios';

const API_URL = 'http://217.114.14.77:8002/games';

export async function getGames() {
    try {
        const response = await axios.get(API_URL);
        return response.data.games; // массив игр из БД
    } catch (error) {
        console.error("Ошибка при получении игр:", error);
        return null;
    }
}

export async function createGame(startTime, endTime, idRegion) {
    try {
        const response = await axios.post(API_URL, {
            start_time: startTime,
            end_time: endTime,
            id_region: idRegion
        });
        return response.data;  // успех / созданная игра
    } catch (error) {
        console.error("Ошибка при создании игры:", error);
        return null;
    }
}