import React, { createContext, useState, useContext, useEffect } from 'react';
import './CartContext.css'; // Импортируем стили для cart-count

const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cartItemCount, setCartItemCount] = useState(0);

	// Функция обновления количества товаров в корзине
	const updateCartCount = () => {
		try {
			const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
			const totalItems = storedCart.reduce((total, item) => total + (item.orderQuantity || 0), 0);
			setCartItemCount(totalItems);
		} catch (error) {
			console.error("Ошибка при загрузке корзины:", error);
		}
	};

	// Функция очистки корзины
	const clearCart = () => {
		localStorage.removeItem('cart'); // Удаляем корзину из localStorage
		setCartItemCount(0); // Сбрасываем счетчик товаров
	};

	// Загружаем данные при монтировании компонента
	useEffect(() => {
		updateCartCount();
	}, []);

	// Отслеживание изменений в localStorage
	useEffect(() => {
		const handleStorageChange = () => {
			updateCartCount();
		};

		window.addEventListener('storage', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);

	return (
		<CartContext.Provider value={{ cartItemCount, updateCartCount, clearCart }}>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => useContext(CartContext);