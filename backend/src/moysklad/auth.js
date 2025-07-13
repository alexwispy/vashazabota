import axios from 'axios';

const login = 'admin@pakhomova2';
const password = 'Qazwsx!!';

// Получение токена
const getToken = async () => {
	const auth = Buffer.from(`${login}:${password}`).toString('base64');
	console.log('Отправляемый заголовок Authorization:', `Basic ${auth}`); // Логируем заголовок для проверки

	try {
		const response = await axios.post(
			'https://api.moysklad.ru/api/remap/1.2/security/token',
			{},  // Пустое тело запроса
			{
				headers: {
					Authorization: `Basic ${auth}`,
					'Accept-Encoding': 'gzip',
				},
			}
		);

		// Статус 200 или 201 с access_token считается успешным
		if ((response.status === 200 || response.status === 201) && response.data.access_token) {
			console.log('Токен получен успешно');
			return response.data.access_token;
		} else {
			console.error('Не удалось получить токен. Статус:', response.status, 'Ответ:', response.data);
			return null;
		}
	} catch (error) {
		// Логируем детализированную ошибку
		console.error('Ошибка при получении токена:', error.response ? error.response.data : error.message);
		return null;
	}
};

export { getToken };
