// Импортируем функцию для получения кэшированных продуктов из правильного пути
import getCachedProducts from './getCachedProducts.js';  // Исправляем путь

const getCategories = (res) => {
	try {
		// Получаем кэшированные продукты
		const products = getCachedProducts();

		// Получаем список уникальных категорий
		const categoriesList = [...new Set(products.map(p => p.productCategory).filter(category => category && category.trim() !== ''))];

		// Если нет категорий, сразу возвращаем ошибку
		if (categoriesList.length === 0) {
			return res.status(404).json({ error: 'Нет доступных категорий.' });
		}

		// Создаем объект для хранения родительских категорий
		const categories = {};

		// Проходим по каждой категории и обрабатываем ее
		categoriesList.forEach(category => {
			const [parentCategory, subCategory] = category.split('/').map(item => item.trim());

			// Если родительская категория не существует, создаем ее
			if (!categories[parentCategory]) {
				categories[parentCategory] = [];
			}

			// Добавляем дочернюю категорию, если она есть
			if (subCategory) {
				categories[parentCategory].push(subCategory);
			}
		});

		// Преобразуем объект категорий в массив для удобства отправки
		const categoriesArray = Object.entries(categories).map(([parent, subcategories]) => ({
			parentCategory: parent,
			subCategories: subcategories
		}));

		if (categoriesArray.length > 0) {
			return res.json(categoriesArray);  // Отправляем список категорий
		} else {
			return res.status(404).json({ error: 'Нет доступных категорий.' });
		}
	} catch (error) {
		console.error('Ошибка при получении категорий:', error);
		return res.status(500).json({ error: 'Ошибка сервера при получении категорий.' });
	}
};

export default getCategories;
