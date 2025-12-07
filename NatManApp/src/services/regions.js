import axios from "axios";

const API_URL = "http://217.114.14.77:8002/regions";

// Получить регионы
export async function getRegions() {
    try {
        const response = await axios.get(API_URL);
        return response.data.regions;   // список регионов
    } catch (error) {
        console.error("Ошибка при получении регионов:", error);
        return null;
    }
}

// Создать регион
export async function createRegion(country, city, street) {
    try {
        const response = await axios.post(API_URL, {
            country: country,
            city: city,
            street: street
        });
        return response.data; 
    } catch (error) {
        console.error("Ошибка при создании региона:", error);
        return null;
    }
}