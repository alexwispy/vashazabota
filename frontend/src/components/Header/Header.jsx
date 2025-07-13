import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext/CartContext'; // Проверьте корректность пути
import './Header.css';

const Header = () => {
	const { cartItemCount } = useCart(); // Подключаемся к глобальному состоянию корзины

	return (
		<header className="header">
			<div className="header__container">
				<Link to="/" className="header__logo">Ваша забота</Link>

				<nav className="header__nav">
					<div className="header__nav-links">
						<Link to="/" className="header__link header__link--home">Главная</Link>
						<Link to="/products" className="header__link header__link--catalog">Каталог</Link>
						<Link to="/contact" className="header__link">Контакты</Link>
					</div>

					<div className="header__cart">
						<Link to="/cart" className="cart-link">
							<span className="cart-icon" role="img" aria-label="Корзина">🛒</span>
							{cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Header;
