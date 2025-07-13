// src/Contact.jsx
import React from 'react';
import './Contact.css';  // Подключаем стили (ваши текущие, без изменений)

const Contact = () => {
	return (
		<div className="contact-page">
			<h1>Контакты</h1>
			<div className="contact-info">
				<p><strong>Часы работы:</strong> Будни с 10:00 до 20:00 <br /> Выходные с 11:00 до 20:00 </p>
				<p><strong>Телефон:</strong> <a href="tel:+79200918276">+7 920 091-82-76</a></p>
				<p><strong>Телеграм-канал:</strong> <a href="https://t.me/vashazabota_ru" target="_blank" rel="noopener noreferrer">Подписаться на канал</a></p>
				<p><strong>Группа ВКонтакте:</strong> <a href="https://vk.com/vashazabota" target="_blank" rel="noopener noreferrer">Перейти в группу</a></p>

				<p><strong>Юридическая информация:</strong></p>
				<p>ИП Пахомов Алексей Олегович</p>
				<p>ИНН: 4022507531300</p>
				<p>Адрес магазина: г. Обнинск, ул. Славского, д. 1</p>
			</div>
		</div>
	);
};

export default Contact;
