const express = require('express');
const fs = require('fs');
const cors = require('cors');
const http = require('http');
const https = require('https');
const getProducts = require('./routes/getProducts');
const getProductById = require('./routes/getProductById');
const getProductsByBrand = require('./routes/getProductsByBrand');
const getBrands = require('./routes/getBrands');
const getCategories = require('./routes/getCategories');
const { sendOrderNotification } = require('./bot');
const imageRouter = require('./routes/imageRoute');

const app = express();

// Разрешаем CORS для локального хоста и вашего сервера
app.use(cors({
	origin: [
		'http://localhost:3000',
		'https://localhost:3000',
		'http://95.163.237.158',
		'https://95.163.237.158'
	],
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Для продакшн-среды используем сертификаты
let sslOptions = {};
if (process.env.NODE_ENV === 'production') {
	sslOptions = {
		key: fs.readFileSync('/path/to/production/private.key'),
		cert: fs.readFileSync('/path/to/production/certificate.crt')
	};
}

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

// Порты для локальной разработки и продакшн-среды
const httpPort = process.env.NODE_ENV === 'production' ? 80 : 5000;  // Порт в зависимости от среды
const httpsPort = process.env.NODE_ENV === 'production' ? 443 : 5001;  // Порт для HTTPS

if (process.env.NODE_ENV === 'production') {
	// Создание HTTPS сервера для продакшн
	https.createServer(sslOptions, app).listen(httpsPort, () => {
		console.log(`HTTPS сервер работает на порту ${httpsPort}`);
	});

	// Создание HTTP сервера и перенаправление на HTTPS
	http.createServer(app).listen(httpPort, () => {
		console.log(`HTTP сервер работает на порту ${httpPort}`);
	});
} else {
	// Локальная разработка
	app.listen(5000, () => {
		console.log('Сервер работает на порту 5000');
	});
}
