import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { getToken } from './auth.js'; // Предполагаем, что эта функция возвращает актуальный токен
import { fileURLToPath } from 'url';

// Настраиваем __dirname для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Пути к файлам для сохранения ассортимента (сырые данные + обработанные)
const rawAssortmentPath = path.join(__dirname, './cache/rawAssortment.json');
const assortmentJsonPath = path.join(__dirname, './cache/assortment.json');

// Проверка существования папки cache и её создание, если не существует
for (const p of [rawAssortmentPath, assortmentJsonPath]) {
	const dir = path.dirname(p);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

/** 
 * Пауза в миллисекундах
 * (5 сек = 5000 ms)
 */
function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Запрашивает ассортимент одним "листом" (limit=50, offset=…),
 * всегда используя FRESH token.
 */
async function fetchOnePage(offset, limit) {
	// При каждом запросе заново получаем токен
	const token = await getToken();
	if (!token) {
		throw new Error('Не удалось получить токен перед запросом.');
	}

	const url = `https://api.moysklad.ru/api/remap/1.2/entity/assortment?limit=${limit}&offset=${offset}`;
	console.log(`Запрашиваем ассортимент: limit=${limit}, offset=${offset}`);

	const response = await axios.get(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const rows = response.data.rows || [];
	return rows;
}

/**
 * Получаем ВСЁ, загружая по 50, с паузой 5с,
 * и перед каждым запросом просим свежий токен.
 */
async function getAllAssortment() {
	let allItems = [];
	let offset = 0;
	const limit = 50;
	let hasMore = true;

	while (hasMore) {
		let rows = [];

		try {
			rows = await fetchOnePage(offset, limit);
		} catch (error) {
			console.error('Ошибка при запросе ассортимента:', error.message);
			break;
		}

		allItems = allItems.concat(rows);

		if (rows.length < limit) {
			hasMore = false;
		} else {
			offset += limit;
			// Пауза 5 секунд
			await delay(5000);
		}
	}

	console.log(`Всего загружено позиций: ${allItems.length}`);
	return allItems;
}

/** Записываем JSON в файл */
function writeJsonToFile(filepath, data, label = '') {
	fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
	console.log(`${label} успешно записан в файл: ${path.basename(filepath)}`);
}

/**
 * Основная функция:
 * 1. Перед КАЖДЫМ запросом получаем свежий токен
 * 2. Грузим по 50 записей
 * 3. Пауза 5с
 * 4. Сохраняем сырые данные в rawAssortment.json
 * 5. Фильтруем "услуги", "упаковка", "комплекты" (точное совпадение)
 * 6. Сохраняем в assortment.json
 */
export const updateProducts = async () => {
	console.log('Начало обработки ассортимента (limit=50, пауза=5с, перед каждым запросом новый токен)...');

	const rawItems = await getAllAssortment();
	if (rawItems.length === 0) {
		console.log('Нет данных о продуктах/группах.');
		return;
	}

	// Сохраняем сырые данные
	writeJsonToFile(rawAssortmentPath, rawItems, 'Сырые данные');

	// Преобразуем в удобный формат
	const assortment = [];
	for (const item of rawItems) {
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

		const priceData = item.salePrices?.find((p) => p.priceType?.name === 'Цена продажи') || {};
		const salePriceData = item.salePrices?.find((p) => p.priceType?.name === 'Цена со скидкой') || {};
		const price = priceData.value ? priceData.value / 100 : 0;
		const salePrice = salePriceData.value ? salePriceData.value / 100 : 0;

		const brand = item.attributes?.find((attr) => attr.name === 'Бренд')?.value || '';
		const expirationDate = item.attributes?.find((attr) => attr.name === 'Срок годности')?.value || '';
		const applicationMethod = item.attributes?.find((attr) => attr.name === 'Способ применения')?.value || '';

		assortment.push({
			id,
			metaType: meta?.type || '',
			name: name || '',
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
		});
	}

	const exclude = ['услуги', 'упаковка', 'комплекты'];
	const filteredAssortment = assortment.filter((item) => {
		const cat = item.productCategory.toLowerCase().trim();
		return !exclude.includes(cat);
	});

	writeJsonToFile(assortmentJsonPath, filteredAssortment, 'Обработанные данные');
	console.log('Обработка завершена. Всего позиций:', filteredAssortment.length);
};

if (process.argv[1] === __filename) {
	updateProducts()
		.then(() => console.log('Обработка завершена.'))
		.catch((error) => console.error('Ошибка при обработке ассортимента:', error));
}
