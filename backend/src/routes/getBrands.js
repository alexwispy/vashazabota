import getCachedProducts from './getCachedProducts.js';  // Импортируем getCachedProducts

const getBrands = (req, res) => {  // ✅ Добавляем req, res
	try {
		const products = getCachedProducts();  // Получаем кэшированные продукты
		
		if (!Array.isArray(products)) {
			console.error('❌ Ошибка: getCachedProducts() вернул некорректные данные:', products);
			return res.status(500).json({ error: 'Ошибка сервера при обработке данных.' });
		}

		// Извлекаем уникальные бренды и фильтруем пустые или undefined значения
		const brands = [...new Set(products.map(p => p.brand).filter(brand => brand && brand.trim() !== ''))];

		console.log(`✅ Найдено брендов: ${brands.length}`);

		if (brands.length > 0) {
			return res.json(brands);  // Отправляем список брендов
		} else {
			return res.status(404).json({ error: 'Нет доступных брендов.' });
		}
	} catch (error) {
		console.error('❌ Ошибка при получении брендов:', error);
		return res.status(500).json({ error: 'Ошибка сервера при получении брендов.' });
	}
};

export default getBrands;
