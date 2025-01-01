const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { getToken } = require('./auth');

const cacheDirectory = path.join(__dirname, '../../cache');

// Проверка существования папки cache
if (!fs.existsSync(cacheDirectory)) {
	fs.mkdirSync(cacheDirectory);
}

// Получение продуктов с МойСклад
const getProducts = async (token) => {
	try {
		const response = await axios.get(
			'https://api.moysklad.ru/api/remap/1.2/entity/product',
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data.rows;
	} catch (error) {
		console.error('Ошибка при получении продуктов:', error);
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
	const token = await getToken();
	if (token) {
		const products = await getProducts(token);
		if (products.length > 0) {
			writeProductsToFile(products);
			console.log('Продукты обновлены.');
		} else {
			console.log('Продукты не получены.');
		}
	} else {
		console.log('Не удалось получить токен.');
	}
};

module.exports = { getProducts, writeProductsToFile, getCachedProducts, updateProducts };
