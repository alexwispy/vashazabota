const express = require('express');
const cors = require('cors');
const { getCachedProducts, updateProducts } = require('./moysklad/products');
const fs = require('fs');
const path = require('path');
const app = express();

// Путь к файлу с временем последнего обновления
const cacheDirectory = path.join(__dirname, '/cache/');
const lastUpdateFilePath = path.join(cacheDirectory, 'lastUpdateProducts.json');

// Разрешаем CORS
app.use(cors());
app.use(express.json());

// Функция для проверки времени последнего обновления
const shouldUpdateProducts = () => {
	try {
		// Проверка, существует ли директория cache, если нет — создаем её
		if (!fs.existsSync(cacheDirectory)) {
			fs.mkdirSync(cacheDirectory);
		}

		// Если файл с временем последнего обновления существует, читаем его
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
		return true;
	}
};

// Эндпоинт для получения продуктов
app.get('/api/products', (req, res) => {
	try {
		const products = getCachedProducts();
		if (products.length > 0) {
			return res.json(products);
		} else {
			return res.status(404).json({ error: 'Кэшированные продукты отсутствуют.' });
		}
	} catch (error) {
		console.error('Ошибка при получении кэшированных продуктов:', error);
		return res.status(500).json({ error: 'Ошибка сервера при получении продуктов.' });
	}
});

// Обновление продуктов
const updateIfNeeded = async () => {
	if (shouldUpdateProducts()) {
		try {
			await updateProducts();
			// Обновляем файл с временем последнего обновления
			const currentTime = new Date().getTime();
			// Проверка существования директории cache перед записью
			if (!fs.existsSync(cacheDirectory)) {
				fs.mkdirSync(cacheDirectory);
			}
			fs.writeFileSync(lastUpdateFilePath, JSON.stringify({ timestamp: currentTime }), 'utf8');
			console.log('Продукты успешно обновлены и время последнего обновления сохранено.');
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
updateIfNeeded();

// Запуск сервера
const port = 5000;
app.listen(port, () => {
	console.log(`Сервер работает на порту ${port}`);
});
