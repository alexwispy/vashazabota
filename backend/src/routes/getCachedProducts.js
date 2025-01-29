import fs from 'fs';
import path from 'path';

// Путь к кэшированному файлу ассортимента
const assortmentJsonPath = path.join(path.resolve(), '../moysklad/cache/assortment.json');

// Функция для получения кэшированных продуктов из файла
const getCachedProducts = () => {
    let products = [];
    if (fs.existsSync(assortmentJsonPath)) {
        products = JSON.parse(fs.readFileSync(assortmentJsonPath, 'utf8'));
    } else {
        console.error('Файл assortment.json не найден.');
    }
    return products;
};

export default getCachedProducts;
