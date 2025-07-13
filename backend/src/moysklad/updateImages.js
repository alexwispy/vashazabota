import axios from "axios";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { getToken } from "./auth.js";
import { fileURLToPath } from "url";

// ✅ Настраиваем __dirname для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDirectory = path.join(__dirname, "..", "..", "public", "img");

// ✅ Создаём папку для изображений, если она не существует
if (!fs.existsSync(imagesDirectory)) {
	fs.mkdirSync(imagesDirectory, { recursive: true });
}

// ✅ Функция ожидания (таймаут)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getProducts = async (token) => {
	try {
		const response = await axios.get("https://api.moysklad.ru/api/remap/1.2/entity/assortment", {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data.rows;
	} catch (error) {
		console.error("❌ Ошибка при запросе ассортимента:", error.message);
		return [];
	}
};

// ✅ Функция для скачивания изображения с автоматическим обновлением токена
const downloadAndConvertImage = async (image, productId, token, attempt = 1) => {
	const webpPath = path.join(imagesDirectory, `${productId}.webp`);

	// ✅ Проверяем, есть ли файл перед отправкой запроса
	if (fs.existsSync(webpPath)) {
		console.log(`✅ Изображение уже есть: ${webpPath}`);
		return;
	}

	try {
		console.log(`📷 [Попытка ${attempt}] Скачиваю изображение для ID ${productId}...`);
		await delay(1000); // ⏳ Задержка перед скачиванием

		const response = await axios.get(image.meta.downloadHref, {
			headers: { Authorization: `Bearer ${token}` },
			responseType: "arraybuffer",
		});

		await sharp(response.data).webp().toFile(webpPath);
		console.log(`✅ Изображение сохранено: ${webpPath}`);
	} catch (error) {
		if (error.response?.status === 401 && attempt < 3) {
			console.warn(`⚠ Токен истёк, запрашиваю новый (попытка ${attempt + 1})...`);
			token = await getToken();
			await downloadAndConvertImage(image, productId, token, attempt + 1);
		} else {
			console.error(`❌ Ошибка при скачивании изображения для ID ${productId}:`, error.message);
		}
	}
};

const updateImages = async () => {
	let token = await getToken();
	if (!token) {
		console.error("❌ Не удалось получить токен.");
		return;
	}

	const products = await getProducts(token);
	if (!products.length) {
		console.log("⚠ Продукты не получены.");
		return;
	}

	let requestCounter = 0;

	for (const product of products) {
		const productId = product.id;
		const webpPath = path.join(imagesDirectory, `${productId}.webp`);

		// ✅ Проверяем, есть ли изображение перед запросом к API
		if (fs.existsSync(webpPath)) {
			console.log(`✅ Изображение уже есть, пропускаем: ${webpPath}`);
			continue;
		}

		console.log(`🔄 Запрос изображений для продукта с ID ${productId}...`);
		await delay(500); // ✅ Пауза перед запросом к API

		try {
			const imagesResponse = await axios.get(product.images.meta.href, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const images = imagesResponse.data.rows;

			for (const image of images) {
				await downloadAndConvertImage(image, productId, token);
			}
		} catch (error) {
			console.error(`❌ Ошибка при обработке изображений продукта ${productId}:`, error.message);
		}

		// ✅ Обновляем токен каждые 3 запроса
		requestCounter++;
		if (requestCounter % 3 === 0) {
			console.log("🔄 Обновляю токен...");
			token = await getToken();
		}
	}

	console.log("✅ Обновление изображений завершено.");
};

// ✅ Запуск функции
updateImages();

export { updateImages };
