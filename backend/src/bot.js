import TelegramBot from 'node-telegram-bot-api';

// Настройки бота
const token = '8150818094:AAGh58G5my--Or8y3cmVzUlZBFCCNwAb184';
const bot = new TelegramBot(token, { polling: false });

// ID канала (замените на ваш полученный ID)
const CHANNEL_ID = '-1002381053550'; // Укажите ваш ID канала

/**
 * Функция для отправки уведомления о заказе
 * @param {string} name - Имя клиента
 * @param {string} phone - Телефон клиента
 * @param {string} address - Адрес клиента
 * @param {Array} products - Список продуктов, заказанных клиентом
 * @param {number} total - Общая сумма заказа
 */
const sendOrderNotification = async (name, phone, address, products, total) => {
	// Формируем список товаров
	const productDetails = products.map(item => `${item.name} (x${item.quantity}) - ${item.price} ₽`).join('\n');

	const message = `
💳 **Новый заказ**:
👤 **Имя**: ${name}
📞 **Телефон**: ${phone}
🏠 **Адрес**: ${address}
🛒 **Товары**: 
${productDetails}
💰 **Итого**: ${total} ₽
  `;

	try {
		await bot.sendMessage(CHANNEL_ID, message, { parse_mode: 'Markdown' });
		console.log('Уведомление отправлено в Telegram.');
	} catch (error) {
		console.error('Ошибка при отправке уведомления:', error);
	}
};

export { sendOrderNotification };
