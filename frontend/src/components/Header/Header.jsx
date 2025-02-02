import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Подключаем стили

const Header = ({ cartItemCount }) => {
	return (
		<header className="header">
			<div className="header__container">
				<Link to="/" className="header__logo">Ваша забота</Link>

				{/* Навигация с "Каталог", "Контакты" и корзина */}
				<nav className="header__nav">
					<div className="header__nav-links">
						{/* !! Добавляем новый класс header__link--catalog !! */}
						<Link to="/products" className="header__link header__link--catalog">
							Каталог
						</Link>
						<Link to="/contact" className="header__link">Контакты</Link>
					</div>

					{/* Корзина с иконкой и количеством товаров */}
					<div className="header__cart">
						<Link to="/cart" className="cart-link">
							<span className="cart-icon">🛒</span>
							{cartItemCount > 0 && (
								<span className="cart-count">{cartItemCount}</span>
							)}
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Header;
