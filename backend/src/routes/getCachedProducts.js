import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Создаём __dirname вручную для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к кэшированному файлу ассортимента
const assortmentJsonPath = path.join(__dirname, '../moysklad/cache/assortment.json');

// Функция для получения кэшированных продуктов
const getCachedProducts = () => {
    try {
        if (!fs.existsSync(assortmentJsonPath)) {
            console.error('⚠️ Файл assortment.json не найден.');
            return [];
        }

        const fileData = fs.readFileSync(assortmentJsonPath, 'utf8');

        if (!fileData.trim()) {
            console.error('⚠️ Файл assortment.json пуст.');
            return [];
        }

        const products = JSON.parse(fileData);
        return Array.isArray(products) ? products : [];
    } catch (error) {
        console.error('❌ Ошибка при чтении кэшированных продуктов:', error);
        return [];
    }
};

export default getCachedProducts;
