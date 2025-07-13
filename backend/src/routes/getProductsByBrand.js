import getCachedProducts from './getCachedProducts.js';  // Получение кэшированных продуктов

const getProductsByBrand = async (req, res) => {
	const { brand } = req.params;  // Получаем бренд из параметров URL

	try {
		const products = await getCachedProducts();  // Получаем кэшированные продукты

		// Фильтруем продукты по бренду и проверяем, чтобы поле brand было валидным
		const filteredProducts = products
			.filter(p => p.brand && p.brand === brand)  // Фильтруем продукты по бренду
			.map(p => ({  // Форматируем ответ, оставляя только нужные поля
				name: p.name,
				price: p.price,
				image: p.image,  // Предположим, что у продукта есть поле image с URL картинки
			}));

		if (filteredProducts.length > 0) {
			return res.json(filteredProducts);  // Отправляем отфильтрованные данные
		} else {
			return res.status(404).json({ error: 'Продукты для этого бренда не найдены.' });
		}
	} catch (error) {
		console.error('Ошибка при получении продуктов по бренду:', error);
		return res.status(500).json({ error: 'Ошибка сервера при получении продуктов по бренду.' });
	}
};

export default getProductsByBrand;
