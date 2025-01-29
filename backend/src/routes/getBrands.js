import getCachedProducts from './getCachedProducts.js';  // Импортируем getCachedProducts

const getBrands = (res) => {
	try {
		const products = getCachedProducts();  // Получаем кэшированные продукты

		// Извлекаем уникальные бренды и фильтруем пустые или undefined значения
		const brands = [...new Set(products.map(p => p.brand).filter(brand => brand && brand.trim() !== ''))];

		if (brands.length > 0) {
			return res.json(brands);  // Отправляем список брендов
		} else {
			return res.status(404).json({ error: 'Нет доступных брендов.' });
		}
	} catch (error) {
		console.error('Ошибка при получении брендов:', error);
		return res.status(500).json({ error: 'Ошибка сервера при получении брендов.' });
	}
};

export default getBrands;
