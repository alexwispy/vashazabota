// src/server.js
const express = require('express');
const cors = require('cors');
const { getCachedProducts } = require('./moysklad/products');
const app = express();

// Разрешаем CORS
app.use(cors());
app.use(express.json());

// Эндпоинт для получения продуктов
app.get('/api/products', (req, res) => {
	try {
		const products = getCachedProducts();
		if (products.length > 0) {
			return res.json(products);
		} else {
			return res.status(404).json({ error: 'Кэшированные продукты отсутствуют.' });
		}
	} catch (error) {
		console.error('Ошибка при получении кэшированных продуктов:', error);
		return res.status(500).json({ error: 'Ошибка сервера при получении продуктов.' });
	}
});

// Запуск сервера
const port = 5000;
app.listen(port, () => {
	console.log(`Сервер работает на порту ${port}`);
});
