import express from 'express';
import path from 'path';
import fs from 'fs';
const router = express.Router();

// Путь к папке с изображениями
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDirectory = path.join(__dirname, '..', '..', 'public', 'img');

// Маршрут для получения изображения по имени файла
router.get('/:imageName', (req, res) => {
	const { imageName } = req.params;

	// Полный путь к изображению
	const imagePath = path.join(imagesDirectory, imageName);

	// Проверяем, существует ли файл
	if (fs.existsSync(imagePath)) {
		// Определяем тип контента (изображение)
		const extname = path.extname(imageName).toLowerCase();
		let contentType = 'image/jpeg';  // По умолчанию

		if (extname === '.png') {
			contentType = 'image/png';
		} else if (extname === '.webp') {
			contentType = 'image/webp';
		}

		// Устанавливаем правильный Content-Type
		res.setHeader('Content-Type', contentType);

		// Отправляем изображение
		res.sendFile(imagePath);
	} else {
		// Если файла нет, отправляем ошибку
		res.status(404).send('Изображение не найдено');
	}
});

export default router;
