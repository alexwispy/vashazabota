const fs = require('fs');
const path = require('path');

// Путь к кэшированному файлу ассортимента
const assortmentJsonPath = path.join(__dirname, '../moysklad/cache/assortment.json');

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

module.exports = getCachedProducts;
