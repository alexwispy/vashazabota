import getBrands from './getBrands.js';
import getCategories from './getCategories.js';
import { transliterate as tr } from 'transliteration';

const fetchData = async () => {
	try {
		// Загружаем список брендов
		const brands = await new Promise((resolve, reject) => {
			getBrands(
				{},
				{
					json: (data) => resolve(Array.isArray(data) ? data : []),
					status: (code) => reject(`Ошибка получения брендов: ${code}`)
				}
			);
		});

		// Загружаем список категорий
		const categories = await new Promise((resolve, reject) => {
			getCategories(
				{},
				{
					json: (data) => resolve(Array.isArray(data) ? data : []),
					status: (code) => reject(`Ошибка получения категорий: ${code}`)
				}
			);
		});

		// Показываем «сырые» категории до форматирования
		console.log("⚠ RAW CATEGORIES (из getCategories):", categories);

		// Функция транслитерации (для брендов и категорий)
		const toTranslit = (text) => {
			if (!text) return '';
			return tr(text)
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '');
		};

		// Форматируем бренды
		const formattedBrands = brands.map((brand) => {
			const slug = toTranslit(brand);
			return { name: slug || 'brand-unknown' };
		});

		// Форматируем категории с учетом подкатегорий
		const formattedCategories = categories.flatMap((category, index) => {
			// Логируем каждую категорию в сыром виде
			console.log(`▶ Обработка категории #${index}:`, category);

			const parentRaw = category.parentCategory || 'category-unknown';
			const parentSlug = toTranslit(parentRaw) || 'category-unknown';

			// Если есть subCategories
			if (Array.isArray(category.subCategories) && category.subCategories.length > 0) {
				console.log(`  ➡ У категории "${parentRaw}" есть подкатегории:`, category.subCategories);
				return category.subCategories.map((sub) => {
					if (!sub) {
						return { parent: parentSlug, sub: null };
					}
					const subSlug = toTranslit(sub) || 'sub-unknown';
					return { parent: parentSlug, sub: subSlug };
				});
			}

			console.log(`  ➡ Категория "${parentRaw}" без подкатегорий`);
			// Если подкатегорий нет
			return [{ parent: parentSlug, sub: null }];
		});

		// Логируем перед возвратом
		console.log("📦 Данные перед возвратом (БЕЗ ТОВАРОВ, только бренды и категории):");
		console.log("Бренды:", formattedBrands);
		console.log("Категории:", formattedCategories);

		return {
			brands: formattedBrands,
			categories: formattedCategories
		};

	} catch (error) {
		console.error('❌ Ошибка при получении данных:', error);
		return { brands: [], categories: [] };
	}
};

export default fetchData;
