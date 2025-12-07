import axios from "axios";

const API_URL = "http://217.114.14.77:8002/teams";

// Получить команды
export async function getTeams() {
    try {
        const response = await axios.get(API_URL);
        return response.data.teams;  // список команд
    } catch (error) {
        console.error("Ошибка при получении команд:", error);
        return null;
    }
}

// Создать команду
export async function createTeam(teamName) {
    try {
        const response = await axios.post(API_URL, {
            team_name: teamName
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при создании команды:", error);
        return null;
    }
}