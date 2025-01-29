import axios from 'axios';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { getToken } from './auth.js';
import { fileURLToPath } from 'url';

// Создаём __dirname вручную для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDirectory = path.join(__dirname, '..', '..', 'public', 'img');

// Создаём папку для изображений, если она не существует
if (!fs.existsSync(imagesDirectory)) {
	fs.mkdirSync(imagesDirectory, { recursive: true });
}

const getProducts = async (token) => {
	const response = await axios.get('https://api.moysklad.ru/api/remap/1.2/entity/assortment', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data.rows;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const updateImages = async () => {
	const token = await getToken();
	if (token) {
		const products = await getProducts(token);
		if (products.length > 0) {
			for (const product of products) {
				await delay(1000); // ✅ Гарантируем паузу перед обработкой следующего продукта
				if (product.images && product.images.meta && product.images.meta.href) {
					const imagesResponse = await axios.get(product.images.meta.href, {
						headers: { Authorization: `Bearer ${token}` },
					});
					const images = imagesResponse.data.rows;

					for (const image of images) {
						const href = image.meta.href;
						const regex = /\/product\/([^\/]+)\/images/;
						const match = href.match(regex);

						if (match && match[1]) {
							const productId = match[1];  // Извлекаем ID
							const webpPath = path.join(imagesDirectory, `${productId}.webp`);

							if (fs.existsSync(webpPath)) {
								console.log(`Изображение для продукта с ID ${productId} уже существует, пропускаю скачивание.`);
								await delay(1000);  // ✅ Задержка перед пропуском
								continue;
							}

							const downloadHref = image.meta.downloadHref;
							if (downloadHref) {
								console.log(`Скачиваю изображение для продукта с ID ${productId}`);
								await delay(1000); // ✅ Задержка перед скачиванием
								const response = await axios.get(downloadHref, {
									headers: { Authorization: `Bearer ${token}` },
									responseType: 'arraybuffer',
								});
								const imageBuffer = response.data;

								await sharp(imageBuffer).webp().toFile(webpPath);
							}
						}
					}
				}
			}
			console.log('Изображения обновлены.');
		} else {
			console.log('Продукты не получены.');
		}
	} else {
		console.log('Не удалось получить токен.');
	}
};

// Запуск функции для обновления изображений
updateImages();

export { updateImages };