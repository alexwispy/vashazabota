// src/Contact.jsx
import React from 'react';
import './Contact.css';  // Подключаем стили

const Contact = () => {
	return (
		<div className="contact-page">
			<h1>Контакты</h1>
			<div className="contact-info">
				<p><strong>Адрес: </strong>
					<a
						href="https://yandex.com/maps/-/CHQLrHPi"
						target="_blank"
						rel="noopener noreferrer"
					>
						Славского, 1, Обнинск, Калужская обл., Россия, 249034
					</a>
				</p>
				<p><strong>Часы работы:</strong> с 10:00 до 20:00</p>
				<p><strong>Телефон:</strong> <a href="tel:+79200918276">+7 920 091-82-76</a></p>
				<p><strong>Наш контакт в:</strong> <a href="https://wa.me/79200918276" target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
				<p><strong>Телеграм:</strong> <a href="https://t.me/yourcare_shop" target="_blank" rel="noopener noreferrer">Перейти в Телеграм</a></p>
				<p><strong>Телеграм-канал:</strong> <a href="https://t.me/yourcare_shop" target="_blank" rel="noopener noreferrer">Подписаться на канал</a></p>
				<p><strong>Группа ВКонтакте:</strong> <a href="https://vk.com/yourcare.shop" target="_blank" rel="noopener noreferrer">Перейти в группу</a></p>

			</div>
		</div>
	);
};

export default Contact;
