import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { getToken } from './auth.js';
import { fileURLToPath } from 'url';

// Настраиваем __dirname для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к файлу для сохранения ассортимента (файл будет сохранён в подпапке cache)
const assortmentJsonPath = path.join(__dirname, './cache/assortment.json');

// Проверка существования папки cache и её создание, если не существует
if (!fs.existsSync(path.dirname(assortmentJsonPath))) {
	fs.mkdirSync(path.dirname(assortmentJsonPath), { recursive: true });
}

/**
 * Получение ассортимента с МойСклад
 */
const getAssortment = async () => {
	const token = await getToken();
	if (!token) {
		throw new Error('Не удалось получить токен.');
	}
	try {
		const response = await axios.get(
			'https://api.moysklad.ru/api/remap/1.2/entity/assortment',
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data.rows;
	} catch (error) {
		console.error('Ошибка при запросе ассортимента:', error.message);
		return [];
	}
};

/**
 * Запись ассортимента в JSON файл
 */
const writeAssortmentToFile = (assortment) => {
	fs.writeFileSync(assortmentJsonPath, JSON.stringify(assortment, null, 2), 'utf8');
	console.log('Ассортимент успешно записан в файл assortment.json');
};

/**
 * Основная обработка ассортимента:
 * 1. Получение ассортимента с API.
 * 2. Формирование нового списка объектов (товаров/папок/комплектов и т.п.) с нужными полями.
 * 3. Фильтрация — удаляем категории "услуги", "упаковка" и "комплекты" (а также их подкатегории).
 * 4. Запись результата в файл.
 */
export const updateProducts = async () => {
	console.log('Начало обработки ассортимента...');

	// Получение ассортимента
	const items = await getAssortment();
	if (items.length === 0) {
		console.log('Нет данных о продуктах/группах.');
		return;
	}

	// Обработка ассортимента и создание списка объектов
	const assortment = [];

	for (const item of items) {
		const {
			id,
			name,
			description,
			pathName,
			code,
			article,
			barcodes,
			quantity,
			meta
		} = item;

		// Извлечение цен
		const priceData =
			item.salePrices?.find((price) => price.priceType?.name === 'Цена продажи') || {};
		const salePriceData =
			item.salePrices?.find((price) => price.priceType?.name === 'Цена со скидкой') || {};

		// Конвертация значений цен (делим на 100, если значение указано)
		const price = priceData.value ? priceData.value / 100 : 0;
		const salePrice = salePriceData.value ? salePriceData.value / 100 : 0;

		// Дополнительные атрибуты (если нужны)
		const brand = item.attributes?.find((attr) => attr.name === 'Бренд')?.value || '';
		const expirationDate = item.attributes?.find((attr) => attr.name === 'Срок годности')?.value || '';
		const applicationMethod = item.attributes?.find((attr) => attr.name === 'Способ применения')?.value || '';

		const newItem = {
			id,
			metaType: meta?.type || '',
			name,
			description: description || '',
			price,
			salePrice,
			article: article || '',
			productCategory: pathName || '',
			brand,
			expirationDate,
			applicationMethod,
			code: code || '',
			barcodes: barcodes || [],
			quantity: quantity || 0
		};

		assortment.push(newItem);
	}

	// Массив категорий, которые нужно исключить
	const exclude = ['услуги', 'упаковка', 'комплекты'];

	// Фильтруем: убираем те объекты, у которых pathName равен 
	// или начинается с одной из категорий из exclude
	const filteredAssortment = assortment.filter((item) => {
		const cat = item.productCategory.toLowerCase().trim();
		return !exclude.some(
			(base) => cat === base || cat.startsWith(base + '/')
		);
	});

	// Записываем отфильтрованные данные в файл assortment.json
	writeAssortmentToFile(filteredAssortment);
};

// Если данный модуль запущен напрямую, запускаем обработку ассортимента
if (process.argv[1] === __filename) {
	updateProducts()
		.then(() => console.log('Обработка завершена.'))
		.catch((error) => console.error('Ошибка при обработке ассортимента:', error));
}
