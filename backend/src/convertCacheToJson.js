const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Путь к файлу с кэшем, который находится в папке backend/cache
const cacheFilePath = path.join(__dirname, '../cache/product.js');
const formattedJsonPath = path.join(__dirname, '../cache/formatted_products.json');
const publicImagesPath = path.join(__dirname, '../public/products');

// Таймаут для скачивания изображений
const DOWNLOAD_TIMEOUT = 10000; // 10 секунд

// Чтение данных из кэша
const products = require(cacheFilePath);

// Чтение существующего formatted_products.json или создание нового
let formattedProducts = [];
if (fs.existsSync(formattedJsonPath)) {
	formattedProducts = JSON.parse(fs.readFileSync(formattedJsonPath, 'utf8'));
}

// Функция для проверки, существует ли изображение для данного продукта
const hasImageDownloaded = (id) => {
	const imagePath = path.join(publicImagesPath, `${id}.webp`);
	return fs.existsSync(imagePath);
};

// Функция для скачивания изображения (закомментировано для проверки)
const downloadImage = async (url, id) => {
	try {
		console.log(`(Скачивание закомментировано) Попытка загрузки изображения для товара ${id}: ${url}`);
		/*
		const response = await axios({
		  url,
		  method: 'GET',
		  responseType: 'stream',
		});
		const imagePath = path.join(publicImagesPath, `${id}.webp`);
		const writer = fs.createWriteStream(imagePath);
		response.data.pipe(writer);
		return new Promise((resolve, reject) => {
		  writer.on('finish', resolve);
		  writer.on('error', reject);
		});
		*/
	} catch (error) {
		console.error(`Ошибка при скачивании изображения для товара ${id}:`, error.message);
	}
};

// Основная обработка продуктов
const processProducts = async () => {
	for (const product of products) {
		const { id, name, description, pathName, code, barcode, barcodes } = product;
		const price = product.salePrices?.[0]?.value / 100 || 0;
		const brand = product.attributes?.find(attr => attr.name === 'Бренд')?.value || '';
		const expirationDate = product.attributes?.find(attr => attr.name === 'Срок годности')?.value || '';
		const applicationMethod = product.attributes?.find(attr => attr.name === 'Способ применения')?.value || '';
		const volume = product.attributes?.find(attr => attr.name === 'Объем')?.value || '';

		// Переносим весь массив barcodes
		const barcodesValues = barcodes || [];

		const imageUrl = product.images?.[0]?.meta?.href || '';

		// Проверяем, существует ли товар в formatted_products
		const existingProduct = formattedProducts.find(p => p.id === id);

		// Если товара ещё нет, добавляем его
		if (!existingProduct) {
			const newProduct = {
				id,
				name,
				description: description || '',
				price,
				article: code || '',
				productCategory: pathName || '',
				brand,
				expirationDate,
				applicationMethod,
				code: code || '',
				barcodes: barcodesValues,  // Переносим весь массив barcodes
				imageUrl,
				volume,
			};
			formattedProducts.push(newProduct);
		}

		// Скачиваем изображение, если его ещё нет (закомментировано для проверки)
		if (imageUrl && !hasImageDownloaded(id)) {
			console.log(`Пропуск скачивания изображения для товара ${id} (для тестирования).`);
			/*
			await downloadImage(imageUrl, id);
			console.log(`Изображение для товара ${id} успешно сохранено.`);
			await new Promise(resolve => setTimeout(resolve, DOWNLOAD_TIMEOUT));
			*/
		}
	}

	// Записываем обновлённые данные в formatted_products.json
	fs.writeFileSync(formattedJsonPath, JSON.stringify(formattedProducts, null, 2), 'utf8');
	console.log('Обновление formatted_products.json завершено.');
};

// Выполняем процесс обработки
processProducts().then(() => {
	console.log('Обработка завершена.');
}).catch(error => {
	console.error('Ошибка при обработке продуктов:', error);
});
