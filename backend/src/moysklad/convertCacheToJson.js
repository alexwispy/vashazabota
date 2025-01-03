const fs = require('fs');
const path = require('path');

// Пути к файлам
const cacheFilePath = path.join(__dirname, './cache/product.json'); // JSON-файл с данными
const formattedJsonPath = path.join(__dirname, './cache/formatted_products.json'); // JSON-файл для сохранения

// Чтение данных из product.json
let products = [];
if (fs.existsSync(cacheFilePath)) {
	products = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
} else {
	console.error('Файл product.json не найден.');
	process.exit(1);
}

// Чтение существующего formatted_products.json или создание нового
let formattedProducts = [];
if (fs.existsSync(formattedJsonPath)) {
	formattedProducts = JSON.parse(fs.readFileSync(formattedJsonPath, 'utf8'));
}

// Основная обработка продуктов
const processProducts = async () => {
	console.log('Начало обработки продуктов...');

	for (const product of products) {
		const { id, name, description, pathName, code, article, barcodes, stock, quantity } = product;

		// Извлечение цен
		const priceData = product.salePrices?.find(price => price.priceType?.name === 'Цена продажи') || {};
		const salePriceData = product.salePrices?.find(price => price.priceType?.name === 'Цена со скидкой') || {};

		// Конвертация значений цен
		const price = priceData.value ? priceData.value / 100 : 0;
		const salePrice = salePriceData.value ? salePriceData.value / 100 : 0;

		// Определяем дополнительные атрибуты
		const brand = product.attributes?.find(attr => attr.name === 'Бренд')?.value || '';
		const expirationDate = product.attributes?.find(attr => attr.name === 'Срок годности')?.value || '';
		const applicationMethod = product.attributes?.find(attr => attr.name === 'Способ применения')?.value || '';

		// Создаём объект для нового продукта
		const newProduct = {
			id,
			name,
			description: description || '',
			price,
			salePrice, // Добавляем цену со скидкой
			article: article || '',
			productCategory: pathName || '',
			brand,
			expirationDate,
			applicationMethod,
			code: code || '',
			barcodes: barcodes || [],
			img: '', // Пустое поле для изображения
			quantity: quantity || 0,
		};

		// Проверяем, существует ли товар в formatted_products
		const existingProduct = formattedProducts.find(p => p.id === id);

		// Если товара ещё нет, добавляем его
		if (!existingProduct) {
			formattedProducts.push(newProduct);
		}
	}

	// Записываем обновлённые данные в formatted_products.json
	fs.writeFileSync(formattedJsonPath, JSON.stringify(formattedProducts, null, 2), 'utf8');
	console.log('Обновление formatted_products.json завершено.');
};

// Выполняем процесс обработки
processProducts()
	.then(() => console.log('Обработка завершена.'))
	.catch(error => console.error('Ошибка при обработке продуктов:', error));
