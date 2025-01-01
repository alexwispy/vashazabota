const fs = require('fs');
const path = require('path');

// Путь к файлу с кэшем, который находится в папке backend/cache
const cacheFilePath = path.join(__dirname, './cache/product.js');
const formattedJsonPath = path.join(__dirname, './cache/formatted_products.json');

// Чтение данных из кэша
const products = require(cacheFilePath);

// Чтение существующего formatted_products.json или создание нового
let formattedProducts = [];
if (fs.existsSync(formattedJsonPath)) {
	formattedProducts = JSON.parse(fs.readFileSync(formattedJsonPath, 'utf8'));
}

// Основная обработка продуктов
const processProducts = async () => {
	console.log('Начало обработки продуктов...'); // Лог начала процесса обработки

	for (const product of products) {
		const { id, name, description, pathName, code, article, barcode, barcodes } = product;
		const price = product.salePrices?.[0]?.value / 100 || 0;
		const brand = product.attributes?.find(attr => attr.name === 'Бренд')?.value || '';
		const expirationDate = product.attributes?.find(attr => attr.name === 'Срок годности')?.value || '';
		const applicationMethod = product.attributes?.find(attr => attr.name === 'Способ применения')?.value || '';

		// Переносим весь массив barcodes
		const barcodesValues = barcodes || [];

		// Создаем объект для нового продукта
		const newProduct = {
			id,
			name,
			description: description || '',
			price,
			article: article || '',  // Артикул теперь из `article`
			productCategory: pathName || '',
			brand,
			expirationDate,
			applicationMethod,
			code: code || '',  // Код теперь из `code`
			barcodes: barcodesValues,  // Переносим весь массив barcodes
			img: '',  // Пустой тег для изображения
			quantity: 0  // Пустой тег для количества
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
	console.log('Обновление formatted_products.json завершено.'); // Лог завершения записи
};

// Выполняем процесс обработки
processProducts().then(() => {
	console.log('Обработка завершена.');
}).catch(error => {
	console.error('Ошибка при обработке продуктов:', error);
});
