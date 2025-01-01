const express = require('express');
const cors = require('cors');
const { getCachedProducts } = require('./moysklad/products');
const app = express();

// Разрешаем CORS
app.use(cors());
app.use(express.json());

// Эндпоинт для получения всех продуктов
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

// Эндпоинт для получения продукта по ID
app.get('/api/products/:id', (req, res) => {
	const { id } = req.params;  // Получаем ID из параметров URL

	try {
		const products = getCachedProducts();
		// Находим продукт по ID
		const product = products.find(p => p.id === id);

		if (product) {
			return res.json(product);  // Если продукт найден, отправляем его
		} else {
			return res.status(404).json({ error: 'Продукт не найден' });  // Продукт не найден
		}
	} catch (error) {
		console.error('Ошибка при получении продукта:', error);
		return res.status(500).json({ error: 'Ошибка сервера при получении продукта.' });
	}
});

// Запуск сервера
const port = 5000;
app.listen(port, () => {
	console.log(`Сервер работает на порту ${port}`);
});
