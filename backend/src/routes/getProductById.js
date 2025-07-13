// routes/getProductById.js
import getCachedProducts from './getCachedProducts.js';  // Исправленный путь

const getProductById = (req, res) => {
	const id = Number(req.params.id);  // Получаем ID из параметров URL и преобразуем в число

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

export default getProductById;
