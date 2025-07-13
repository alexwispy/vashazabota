import getCachedProducts from './getCachedProducts.js';

const getProducts = (req, res) => {  // ✅ Теперь req передаётся правильно
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
};

export default getProducts;


















