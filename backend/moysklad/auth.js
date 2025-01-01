const axios = require('axios');

const login = 'admin@pakhomova2';
const password = 'keypass11';

// Получение токена
const getToken = async () => {
	const auth = Buffer.from(`${login}:${password}`).toString('base64');
	console.log('Отправляемый заголовок Authorization:', `Basic ${auth}`); // Логируем заголовок для проверки

	try {
		const response = await axios.post(
			'https://api.moysklad.ru/api/remap/1.2/security/token',
			{},
			{
				headers: {
					Authorization: `Basic ${auth}`,
					'Accept-Encoding': 'gzip',
				},
			}
		);

		// Проверяем статус ответа и токен
		if (response.status === 200) {
			console.log('Токен получен успешно');
			return response.data.access_token;
		} else {
			console.error('Не удалось получить токен. Статус:', response.status);
			return null;
		}
	} catch (error) {
		// Логируем детализированную ошибку
		console.error('Ошибка при получении токена:', error.response ? error.response.data : error.message);
		return null;
	}
};

module.exports = { getToken };
