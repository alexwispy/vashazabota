const fs = require('fs');
const path = require('path');

// Путь к файлу с кэшем, который находится в папке backend/cache
const cacheFilePath = path.join(__dirname, './cache/product.js');

// Чтение данных из кэша
const products = require(cacheFilePath);

// Преобразование данных в более удобный формат
const transformedProducts = products.map(product => {
	const name = product.name;  // Наименование товара
	const price = product.salePrices?.[0]?.value / 100 || 0;  // Цена товара в рублях

	// Дополнительная информация, если она есть (например, объем)
	const volume = product.attributes?.find(attr => attr.name === 'Объем')?.value || '';  // Объем товара

	// Извлечение пути и кода товара
	const pathName = product.pathName || '';  // Путь товара (если есть)
	const code = product.code || '';  // Код товара (если есть)

	// Извлечение бренда из attributes
	const brand = product.attributes?.find(attr => attr.name === 'Бренд')?.value || '';  // Бренд товара

	// Извлечение срока годности
	const expirationDate = product.attributes?.find(attr => attr.name === 'Срок годности')?.value || '';  // Срок годности

	// Извлечение способа применения
	const applicationMethod = product.attributes?.find(attr => attr.name === 'Способ применения')?.value || '';  // Способ применения

	return {
		id: product.id,
		name: name,
		description: product.description || '',  // Описание товара
		price: price,
		imageUrl: product.images?.[0]?.url || '',  // Ссылка на изображение
		volume: volume,
		pathName: pathName,  // Добавляем путь
		code: code,  // Добавляем код
		brand: brand,  // Добавляем бренд
		expirationDate: expirationDate,  // Добавляем срок годности
		applicationMethod: applicationMethod,  // Добавляем способ применения
	};
});

// Путь для записи отформатированного JSON
const outputFilePath = path.join(__dirname, './cache/formatted_products.json');

// Запись отформатированных данных в новый JSON файл
fs.writeFileSync(outputFilePath, JSON.stringify(transformedProducts, null, 2), 'utf8');

console.log('Кэш преобразован в формат JSON и сохранен в', outputFilePath);
