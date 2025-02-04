import express from 'express';
import cors from 'cors';
import http from 'http';
import compression from 'compression'; // Подключаем Gzip-сжатие

import getProducts from './routes/getProducts.js';
import getProductById from './routes/getProductById.js';
import getProductsByBrand from './routes/getProductsByBrand.js';
import getBrands from './routes/getBrands.js';
import getCategories from './routes/getCategories.js';
import { sendOrderNotification } from './bot.js';
import imageRouter from './routes/imageRoute.js';
import sitemapRouter from './routes/sitemap.js';
import robotsRouter from './routes/robots.js';

const app = express();

// Включаем GZIP-сжатие
app.use(compression());

// Разрешаем CORS для фронтенда
const allowedOrigins = ['https://vashazabota.ru', 'http://localhost:3000'];

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
}));

// Логируем входящие запросы
app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});

// Добавляем маршруты для robots.txt и sitemap.xml
app.use('/', robotsRouter);
app.use('/', sitemapRouter);

// Парсим JSON
app.use(express.json());

// Эндпоинты API
app.get('/api/products', getProducts);
app.get('/api/products/:id', getProductById);
app.get('/api/products/brand/:brand', getProductsByBrand);
app.get('/api/brands', getBrands);
app.get('/api/categories', getCategories);
app.use('/images', imageRouter);

// Эндпоинт для создания заказа
app.post('/api/order', async (req, res) => {
	const { name, phone, address, products, total } = req.body;

	if (!name || !phone || !address || !products || !total) {
		return res.status(400).send('Пожалуйста, заполните все поля!');
	}

	try {
		await sendOrderNotification(name, phone, address, products, total);
		res.status(200).send('Заказ принят и уведомление отправлено.');
	} catch (error) {
		console.error('Ошибка при отправке уведомления:', error);
		res.status(500).send('Произошла ошибка при отправке уведомления.');
	}
});

// ✅ Фиксированный порт для Nginx-проксирования
const PORT = 5001;

// Запускаем HTTP-сервер (Nginx будет проксировать запросы)
http.createServer(app).listen(PORT, () => {
	console.log(`✅ API сервер запущен на порту ${PORT}`);
});
