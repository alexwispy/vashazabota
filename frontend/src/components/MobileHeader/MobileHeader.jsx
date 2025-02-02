import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiGrid } from 'react-icons/fi'; // Добавлена иконка для "Каталог"
import './MobileHeader.css';

const MobileHeader = ({ onCatalogClick }) => {
	return (
		<nav className="mobile-header">
			{/* Ссылка на главную */}
			<Link to="/" className="mobile-header-item">
				<FiHome />
				<span>Главная</span>
			</Link>

			{/* Ссылка на каталог */}
			<Link
				to="/products"
				className="mobile-header-item"
				onClick={onCatalogClick} // Открытие боковой панели
			>
				<FiGrid />
				<span>Каталог</span>
			</Link>

			{/* Ссылка на корзину */}
			<Link to="/cart" className="mobile-header-item">
				<FiShoppingCart />
				<span>Корзина</span>
			</Link>
		</nav>
	);
};

export default MobileHeader;
