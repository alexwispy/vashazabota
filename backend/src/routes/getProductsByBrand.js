// routes/getProductsByBrand.js
const { getCachedProducts } = require('../moysklad/products');

const getProductsByBrand = (req, res) => {
	const { brand } = req.params;  // Получаем бренд из параметров URL

	try {
		const products = getCachedProducts();
		// Фильтрация продуктов по бренду
		const filteredProducts = products.filter(p => p.brand && p.brand.toLowerCase() === brand.toLowerCase());

		if (filteredProducts.length > 0) {
			return res.json(filteredProducts);  // Отправляем отфильтрованные товары
		} else {
			return res.status(404).json({ error: 'Товары для данного бренда не найдены.' });
		}
	} catch (error) {
		console.error('Ошибка при получении товаров по бренду:', error);
		return res.status(500).json({ error: 'Ошибка сервера при получении товаров по бренду.' });
	}
};

module.exports = getProductsByBrand;
