// src/components/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';  // Подключаем стили для футера
import { FaTelegram, FaVk } from 'react-icons/fa';  // Иконки для соцсетей

const Footer = () => {
	return (
		<footer className="footer">
			<div className="footer__container">
				{/* Контактная информация */}
				<div className="footer__contacts">
					<p><strong>Адрес:</strong> Славского, 1, Обнинск, Калужская обл., Россия, 249034</p>
					<p><strong>Телефон:</strong> <a href="tel:+79200918276">+7 920 091-82-76</a></p>
					<p><strong>Часы работы:</strong> Будни с 10:00 до 20:00, выходные с 11:00 до 20:00</p>
				</div>

				{/* Социальные сети */}
				<div className="footer__social">
					<h3>Мы в социальных сетях:</h3>
					<a href="https://t.me/vashazabota_ru" target="_blank" rel="noopener noreferrer">
						<FaTelegram />
					</a>
					<a href="https://vk.com/vashazabota" target="_blank" rel="noopener noreferrer">
						<FaVk />
					</a>
				</div>

				{/* Дополнительные ссылки */}
				<div className="footer__links">
					<Link to="/privacy-policy">Политика конфиденциальности</Link>
					<Link to="/payment-rules">Правила оплаты</Link>
					<Link to="/return-and-exchange" className="nowrap">Условия обмена и возврата</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
