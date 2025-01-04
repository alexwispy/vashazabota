const express = require('express');
const cors = require('cors');
const getProducts = require('./routes/getProducts');  // Эндпоинт для всех продуктов
const getProductById = require('./routes/getProductById');  // Эндпоинт для продукта по ID
const getProductsByBrand = require('./routes/getProductsByBrand');  // Эндпоинт для продуктов по бренду
const getBrands = require('./routes/getBrands');  // Новый эндпоинт для брендов
const getCategories = require('./routes/getCategories');  // Новый эндпоинт для категорий
const { sendOrderNotification } = require('./bot');  // Импортируем функцию для отправки уведомлений
const imageRouter = require('./routes/imageRoute');  // Подключаем роутер для изображений

const app = express();

// Разрешаем CORS
app.use(cors());
app.use(express.json());  // Для парсинга JSON в теле запроса

// Эндпоинт для получения всех продуктов
app.get('/api/products', getProducts);

// Эндпоинт для получения продукта по ID
app.get('/api/products/:id', getProductById);

// Эндпоинт для получения товаров по бренду
app.get('/api/products/brand/:brand', getProductsByBrand);

// Эндпоинт для получения всех брендов
app.get('/api/brands', getBrands);

// Эндпоинт для получения категорий
app.get('/api/categories', getCategories);  // Новый маршрут для получения категорий

// Эндпоинт для обслуживания изображений
app.use('/images', imageRouter);

// Эндпоинт для создания заказа
app.post('/api/order', async (req, res) => {
	const { name, phone, address, products, total } = req.body;

	// Валидация обязательных полей
	if (!name || !phone || !address || !products || !total) {
		return res.status(400).send('Пожалуйста, заполните все поля!');
	}

	try {
		// Отправка уведомления через бота
		await sendOrderNotification(name, phone, address, products, total);

		// Ответ клиенту
		res.status(200).send('Заказ принят и уведомление отправлено.');
	} catch (error) {
		console.error('Ошибка при отправке уведомления:', error);
		res.status(500).send('Произошла ошибка при отправке уведомления.');
	}
});

// Запуск сервера
const port = 5000;
app.listen(port, () => {
	console.log(`Сервер работает на порту ${port}`);
});
