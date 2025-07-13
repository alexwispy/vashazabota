import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import cors from 'cors';
import compression from 'compression';
import getProducts from './routes/getProducts.js';
import getProductById from './routes/getProductById.js';
import getProductsByBrand from './routes/getProductsByBrand.js';
import getBrands from './routes/getBrands.js';
import getCategories from './routes/getCategories.js';
import { sendOrderNotification } from './bot.js';
import imageRouter from './routes/imageRoute.js';
import sitemapRouter from './routes/sitemap.js';

const app = express();

// Включаем GZIP-сжатие
app.use(compression());

// Разрешаем CORS для фронтенда
const allowedOrigins = ['https://vashazabota.ru', 'https://vashazabota.ru:5001'];
//const allowedOrigins = ["http://localhost", "http://localhost:3000"];

app.options('/api/*', (req, res) => {
	res.header('Access-Control-Allow-Origin', "https://vashazabota.ru");
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
 	res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
 	res.header('Access-Control-Allow-Credentials', 'true');
 	res.sendStatus(204);
 });

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

// Парсим JSON
app.use(express.json());

// Эндпоинты API
app.get('/api/products', getProducts);
app.get('/api/products/:id', getProductById);
app.get('/api/products/brand/:brand', getProductsByBrand);
app.get('/api/brands', getBrands);
app.get('/api/categories', getCategories);

// Эндпоинты для изображений и статических файлов
app.use('/images', imageRouter);

// Маршрут sitemap.xml
app.use('/', sitemapRouter);

// Эндпоинт для создания заказа
app.post('/api/order', async (req, res) => {
	console.log('Тело запроса:', req.body);
	const { name, phone, address, products, total } = req.body;

	if (!name || !phone || !address || !products || !total) {
		console.error('Некорректные данные. Отсутствуют обязательные поля.');
		return res.status(400).json({ error: 'Пожалуйста, заполните все поля!' });
	}

	try {
		await sendOrderNotification(name, phone, address, products, total);
		res.status(200).json({ message: 'Заказ принят и уведомление отправлено.' }); // Теперь JSON
	} catch (error) {
		console.error('Ошибка при отправке уведомления:', error);
		res.status(500).json({ error: 'Произошла ошибка при отправке уведомления.' }); // Теперь JSON
	}
});



const port = 5001;

// Раскомитить в Production  
// Загружаем SSL/TLS-сертификаты
 const options = {
 	key: fs.readFileSync('/etc/letsencrypt/live/vashazabota.ru/privkey.pem'),
 	cert: fs.readFileSync('/etc/letsencrypt/live/vashazabota.ru/fullchain.pem'),
 };

 https.createServer(options, app).listen(port, () => {
	console.log(`HTTPS сервер работает на порту ${port}`);
 });


// Раскомитить в Development
//http.createServer(app).listen(port, () => {
//	console.log(`HTTP сервер работает на порту ${port}`);
//});
