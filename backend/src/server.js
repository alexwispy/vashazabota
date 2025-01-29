import express from 'express';
import fs from 'fs';
import cors from 'cors';
import http from 'http';
import https from 'https';
import getProducts from './routes/getProducts.js';
import getProductById from './routes/getProductById';
import getProductsByBrand from './routes/getProductsByBrand';
import getBrands from './routes/getBrands';
import getCategories from './routes/getCategories';
import { sendOrderNotification } from './bot';
import imageRouter from './routes/imageRoute';

const app = express();

// Разрешаем CORS
const allowedOrigins = ['https://vashazabota.ru', 'https://vashazabota.ru:5001', 'http://localhost:3000'];

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true, // Если нужно передавать куки
}));

// Для парсинга JSON в теле запроса
app.use(express.json());

// Эндпоинт для получения всех продуктов
app.get('/api/products', getProducts);

// Эндпоинт для получения продукта по ID
app.get('/api/products/:id', getProductById);

// Эндпоинт для получения товаров по бренду
app.get('/api/products/brand/:brand', getProductsByBrand);

// Эндпоинт для получения всех брендов
app.get('/api/brands', getBrands);

// Эндпоинт для получения категорий
app.get('/api/categories', getCategories);

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

// Порты для локальной и продакшн-среды
const args = process.argv.slice(2);
const useHttps = args.includes('--https');
const httpPort = useHttps ? 5000 : 3001;   // Порт для HTTP
const httpsPort = useHttps ? 5001 : 3001; // Порт для HTTPS

if (useHttps) {
	// Настройки SSL для продакшн-среды
	const sslOptions = {
		key: fs.readFileSync('/etc/letsencrypt/live/vashazabota.ru/privkey.pem'),
		cert: fs.readFileSync('/etc/letsencrypt/live/vashazabota.ru/fullchain.pem')
	};

	// Создание HTTPS сервера для продакшн
	https.createServer(sslOptions, app).listen(httpsPort, () => {
		console.log(`HTTPS сервер работает на порту ${httpsPort}`);
	});

	// Создание HTTP сервера и перенаправление на HTTPS
	http.createServer(app).listen(httpPort, () => {
		console.log(`HTTP сервер работает на порту ${httpPort}`);
	});
} else {
	// Создание HTTP сервера для локальной среды
	http.createServer(app).listen(httpPort, () => {
		console.log(`HTTP сервер работает на порту ${httpPort}`);
	});
}