import TelegramBot from 'node-telegram-bot-api';

// Токен бота
const token = '8150818094:AAGh58G5my--Or8y3cmVzUlZBFCCNwAb184';
const bot = new TelegramBot(token, { polling: true });

const ORDER_CHANNEL_ID = '-1002381053550'; // Канал для уведомлений о заказах
const MINI_APP_URL = 'https://vashazabota.ru/'; // Ссылка на Mini App

// Обработчик /start (всегда открывает Mini App)
bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id;

	// Открытие Mini App в любом случае
	const keyboard = {
		inline_keyboard: [
			[{ text: "🛍 Открыть магазин", web_app: { url: MINI_APP_URL } }]
		]
	};

	bot.sendMessage(chatId, `📌 Наш адрес: Обнинск, ул. Славского дом 1, 2 этаж.

Нажмите кнопку ниже, чтобы открыть магазин:`, {
		reply_markup: keyboard
	});
});

/**
 * Функция отправки уведомления о заказе
 */
const sendOrderNotification = async (name, phone, address, products, total) => {
	const productDetails = products
		.map(item => `${item.name} (x${item.quantity}) - ${item.price} ₽`)
		.join('\n');

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
		await bot.sendMessage(ORDER_CHANNEL_ID, message, { parse_mode: 'Markdown' });
		console.log('Уведомление отправлено в Telegram.');
	} catch (error) {
		console.error('Ошибка при отправке уведомления:', error);
	}
};


export { sendOrderNotification };