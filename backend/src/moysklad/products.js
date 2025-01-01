const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { getToken } = require('./auth');

// Определяем базовый путь относительно текущей рабочей директории
const baseDirectory = __dirname;  // Это возвращает директорию, где находится сам скрипт
const cacheDirectory = path.join(baseDirectory, 'cache');  // Путь к папке 'cache' в той же директории
const lastUpdateFilePath = path.join(cacheDirectory, 'lastUpdateProducts.json');

// Проверка существования папки cache и её создание, если не существует
if (!fs.existsSync(cacheDirectory)) {
	fs.mkdirSync(cacheDirectory);
}

// Функция для проверки времени последнего обновления
const shouldUpdateProducts = () => {
	try {
		// Проверка, существует ли файл с временем последнего обновления
		if (fs.existsSync(lastUpdateFilePath)) {
			const lastUpdate = JSON.parse(fs.readFileSync(lastUpdateFilePath, 'utf8'));
			const currentTime = new Date().getTime();
			const timeElapsed = currentTime - lastUpdate.timestamp;

			// Если с последнего обновления прошло больше 24 часов, обновляем
			return timeElapsed > 86400000;
		} else {
			// Если файл не существует, обновляем данные
			return true;
		}
	} catch (error) {
		console.error('Ошибка при проверке времени последнего обновления:', error);
		return true;  // В случае ошибки всегда обновляем
	}
};

// Получение продуктов с МойСклад (закомментировано реальное обращение к API)
const getProducts = async (token) => {
	// Закомментировано реальное обращение к API
	const response = await axios.get('https://api.moysklad.ru/api/remap/1.2/entity/product', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data.rows;

	// Чтение данных из кэшированного файла
	const filePath = path.join(cacheDirectory, 'product.js');
	if (fs.existsSync(filePath)) {
		return require(filePath);  // Возвращаем данные из кэша
	} else {
		console.log('Нет кэшированных данных.');
		return [];
	}
};

// Запись продуктов в файл
const writeProductsToFile = (products) => {
	const filePath = path.join(cacheDirectory, 'product.js');
	const content = `module.exports = ${JSON.stringify(products, null, 2)};`;
	fs.writeFile(filePath, content, 'utf8', (err) => {
		if (err) {
			console.error('Ошибка при записи данных в файл:', err);
		} else {
			console.log('Продукты успешно записаны в файл product.js');
		}
	});
};

// Получение продуктов из кэша
const getCachedProducts = () => {
	const filePath = path.join(cacheDirectory, 'product.js');
	if (fs.existsSync(filePath)) {
		return require(filePath);
	} else {
		console.log('Нет кэшированных данных.');
		return [];
	}
};

// Обновление продуктов
const updateProducts = async () => {
	const token = await getToken(); // Получаем токен для доступа к API
	if (token) {
		const products = await getProducts(token); // Получаем данные продуктов (из кэша)
		if (products.length > 0) {
			writeProductsToFile(products); // Записываем в файл
			const currentTime = new Date().getTime();
			// Обновляем файл с временем последнего обновления
			fs.writeFileSync(lastUpdateFilePath, JSON.stringify({ timestamp: currentTime }), 'utf8');
			console.log('Продукты обновлены.');
		} else {
			console.log('Продукты не получены.');
		}
	} else {
		console.log('Не удалось получить токен.');
	}
};

// Обновление продуктов по расписанию (каждые 24 часа)
const updateIfNeeded = async () => {
	if (shouldUpdateProducts()) {
		try {
			await updateProducts(); // Обновляем продукты, если прошло более 24 часов
			const currentTime = new Date().getTime();
			// Обновляем файл с временем последнего обновления
			fs.writeFileSync(lastUpdateFilePath, JSON.stringify({ timestamp: currentTime }), 'utf8');
			console.log('Продукты успешно обновлены и время последнего обновления сохранено.');

			// Больше не вызываем скрипт convertCacheToJson.js автоматически
			console.log('Теперь можно вручную запустить скрипт convertCacheToJson.js');
		} catch (error) {
			console.error('Ошибка при обновлении продуктов:', error);
		}
	} else {
		console.log('Обновление продуктов не требуется (меньше 24 часов с последнего обновления).');
	}
};

// Устанавливаем интервал для обновления данных раз в день (86400000 миллисекунд)
setInterval(updateIfNeeded, 86400000);

// Инициализация: проверка и обновление продуктов при запуске
updateIfNeeded();  // Это можно раскомментировать, если хотите сразу после старта проверку

module.exports = { getProducts, writeProductsToFile, getCachedProducts, updateProducts, shouldUpdateProducts, updateIfNeeded };
