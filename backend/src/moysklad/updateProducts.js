import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { getToken } from './auth';

// Путь к файлу для сохранения ассортимента
const assortmentJsonPath = path.join(path.dirname(new URL(import.meta.url).pathname), './cache/assortment.json'); // JSON-файл для сохранения

// Проверка существования папки cache и её создание, если не существует
if (!fs.existsSync(path.dirname(assortmentJsonPath))) {
	fs.mkdirSync(path.dirname(assortmentJsonPath), { recursive: true });
}

// Получение ассортимента с МойСклад
const getAssortment = async () => {
	const token = await getToken();
	if (!token) {
		throw new Error('Не удалось получить токен.');
	}
	try {
		const response = await axios.get('https://api.moysklad.ru/api/remap/1.2/entity/assortment', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data.rows;
	} catch (error) {
		console.error('Ошибка при запросе ассортимента:', error.message);
		return [];
	}
};

// Запись ассортимента в JSON файл
const writeAssortmentToFile = (assortment) => {
	fs.writeFileSync(assortmentJsonPath, JSON.stringify(assortment, null, 2), 'utf8');
	console.log('Ассортимент успешно записан в файл assortment.json');
};

// Основная обработка ассортимента
const updateProducts = async () => {
	console.log('Начало обработки ассортимента...');

	// Получение ассортимента
	const products = await getAssortment();
	if (products.length === 0) {
		console.log('Нет данных о продуктах.');
		return;
	}

	// Обработка ассортимента и создание нового списка продуктов
	let assortment = [];

	for (const product of products) {
		const { id, name, description, pathName, code, article, barcodes, quantity } = product;

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
			quantity: quantity || 0, // Убираем поле img
		};

		// Добавляем новый продукт в ассортимент
		assortment.push(newProduct);
	}

	// Записываем обновлённые данные в assortment.json
	writeAssortmentToFile(assortment);
};

// Экспортируем функцию для использования в других частях проекта
export { updateProducts };

// Если нужно сразу запустить обработку
if (import.meta.url === `file://${process.argv[1]}`) {
	updateProducts()
		.then(() => console.log('Обработка завершена.'))
		.catch(error => console.error('Ошибка при обработке ассортимента:', error));
}
