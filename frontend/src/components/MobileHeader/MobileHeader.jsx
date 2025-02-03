import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiGrid } from 'react-icons/fi';
import { useCart } from '../CartContext/CartContext'; // Подключаем глобальное состояние корзины
import './MobileHeader.css'; // Импортируем стили для mobile-header

const MobileHeader = ({ onCatalogClick }) => {
	const navigate = useNavigate();
	const { cartItemCount } = useCart(); // Подключаем счетчик товаров в корзине

	const handleCatalogClick = (e) => {
		e.preventDefault();
		onCatalogClick(); // Переключаем сайдбар
		navigate('/products'); // Переход в каталог
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
		</nav>
	);
};

export default MobileHeader;
