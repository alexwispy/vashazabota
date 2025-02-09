import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiGrid } from 'react-icons/fi';
import { useCart } from '../CartContext/CartContext'; // Подключаем глобальное состояние корзины
import './MobileHeader.css'; // Импортируем стили для mobile-header

const MobileHeader = ({ onCatalogClick }) => {
	const navigate = useNavigate();
	const location = useLocation(); // Получаем текущий путь
	const { cartItemCount } = useCart(); // Подключаем счетчик товаров в корзине

	const handleCatalogClick = (e) => {
		e.preventDefault();
		if (location.pathname === '/products') {
			// Если уже на странице "Каталог", переключаем сайдбар
			onCatalogClick();
		} else {
			// Иначе переходим на страницу "Каталог"
			navigate('/products');
		}
	};

	// Функция закрытия мини-приложения
	const handleCloseApp = () => {
		if (window.Telegram?.WebApp) {
			window.Telegram.WebApp.close();
		}
	};

	return (
		<nav className="mobile-header">
			<button className="mobile-header-item" onClick={() => navigate('/')}>
				<FiHome />
				<span>Главная</span>
			</button>

			<button className="mobile-header-item" onClick={handleCatalogClick}>
				<FiGrid />
				<span>Каталог</span>
			</button>

			<button className="mobile-header-item" onClick={() => navigate('/cart')}>
				<FiShoppingCart />
				<span>Корзина</span>
				{cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>} {/* Показываем счетчик */}
			</button>

			{/* Кнопка закрытия мини-приложения (показывается только в Telegram) */}
			{window.Telegram?.WebApp && (
				<button className="mobile-header-item close-btn" onClick={handleCloseApp}>
					<FiX />
					<span>Закрыть</span>
				</button>
			)}
		</nav>
	);
};

export default MobileHeader;
