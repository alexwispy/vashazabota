const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Путь к папке с изображениями
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

module.exports = router;
