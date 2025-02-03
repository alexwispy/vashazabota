import express from 'express';
import fetchData from './fetchData.js';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
	try {
		const baseUrl = 'https://vashazabota.ru';

		// Загружаем данные (бренды и категории, товары не нужны)
		const { brands, categories } = await fetchData();

		let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
		sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

		// 🔹 Статические страницы
		const staticPages = [
			'/',
			'/products',
			'/contact',
			'/cart',
			'/checkout',
			'/privacy-policy',
			'/payment-rules',
			'/return-and-exchange'
		];

		staticPages.forEach(page => {
			sitemap += `<url><loc>${baseUrl}${page}</loc><priority>0.9</priority></url>\n`;
		});

		// 🔹 Бренды
		brands.forEach(brand => {
			// brand.name (например, 'yourcare-vasha-zabota')
			sitemap += `<url><loc>${baseUrl}/products/brand/${brand.name}</loc><priority>0.8</priority></url>\n`;
		});

		// 🔹 Категории и подкатегории
		// Пример: { parent: 'hozyaystvennye-tovary', sub: 'geli-dlya-stirki' }
		categories.forEach(cat => {
			// Если sub != null, значит есть подкатегория
			if (cat.sub) {
				sitemap += `<url><loc>${baseUrl}/products/category/${cat.parent}/${cat.sub}</loc><priority>0.7</priority></url>\n`;
			} else {
				// Нет подкатегории — значит только родитель
				sitemap += `<url><loc>${baseUrl}/products/category/${cat.parent}</loc><priority>0.7</priority></url>\n`;
			}
		});

		sitemap += `</urlset>`;

		res.header('Content-Type', 'application/xml');
		res.send(sitemap);

	} catch (error) {
		console.error('Ошибка генерации Sitemap:', error);
		res.status(500).send('Ошибка сервера');
	}
});

export default router;
