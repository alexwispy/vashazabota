// routes/getProductById.js
const getCachedProducts = require('./getCachedProducts');  // Исправленный путь

const getProductById = (req, res) => {
	const { id } = req.params;  // Получаем ID из параметров URL

	try {
		const products = getCachedProducts();
		// Находим продукт по ID
		const product = products.find(p => p.id === id);

		if (product) {
			return res.json(product);  // Если продукт найден, отправляем его
		} else {
			return res.status(404).json({ error: 'Продукт не найден' });  // Продукт не найден
		}
	} catch (error) {
		console.error('Ошибка при получении продукта:', error);
		return res.status(500).json({ error: 'Ошибка сервера при получении продукта.' });
	}
};

module.exports = getProductById;
