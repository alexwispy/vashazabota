const express = require('express');
const cors = require('cors');
const getProducts = require('./routes/getProducts');  // Эндпоинт для всех продуктов
const getProductById = require('./routes/getProductById');  // Эндпоинт для продукта по ID
const getProductsByBrand = require('./routes/getProductsByBrand');  // Эндпоинт для продуктов по бренду
const getBrands = require('./routes/getBrands');  // Новый эндпоинт для брендов

const app = express();

// Разрешаем CORS
app.use(cors());
app.use(express.json());

// Эндпоинт для получения всех продуктов
app.get('/api/products', getProducts);

// Эндпоинт для получения продукта по ID
app.get('/api/products/:id', getProductById);

// Эндпоинт для получения товаров по бренду
app.get('/api/products/brand/:brand', getProductsByBrand);

// Эндпоинт для получения всех брендов
app.get('/api/brands', getBrands);  // Новый маршрут для получения брендов

// Запуск сервера
const port = 5000;
app.listen(port, () => {
	console.log(`Сервер работает на порту ${port}`);
});
