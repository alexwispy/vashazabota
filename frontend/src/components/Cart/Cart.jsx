// src/components/Cart/Cart.jsx
import React, { useState } from 'react';
import './Cart.css';

function Cart() {
	// Статические данные корзины для примера
	const [cartItems, setCartItems] = useState([
		{
			id: 1,
			name: 'Продукт 1',
			price: 1000,
			quantity: 2,
			image: '/images/products/default-image.jpg',
		},
		{
			id: 2,
			name: 'Продукт 2',
			price: 500,
			quantity: 1,
			image: '/images/products/default-image.jpg',
		},
	]);

	// Функция для удаления товара из корзины
	const removeItem = (id) => {
		setCartItems(cartItems.filter(item => item.id !== id));
	};

	// Функция для увеличения количества товара
	const increaseQuantity = (id) => {
		setCartItems(cartItems.map(item =>
			item.id === id ? { ...item, quantity: item.quantity + 1 } : item
		));
	};

	// Функция для уменьшения количества товара
	const decreaseQuantity = (id) => {
		setCartItems(cartItems.map(item =>
			item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
		));
	};

	return (
		<div className="cart">
			<h2>Корзина</h2>

			{cartItems.length === 0 ? (
				<p>Корзина пуста</p>
			) : (
				<div className="cart-items">
					{cartItems.map((item) => (
						<div key={item.id} className="cart-item">
							<img src={item.image} alt={item.name} className="cart-item-image" />
							<div className="cart-item-details">
								<p className="cart-item-name">{item.name}</p>
								<p className="cart-item-price">{item.price} ₽</p>
								<p className="cart-item-quantity">Количество: {item.quantity}</p>
								<div className="quantity-controls">
									<button onClick={() => decreaseQuantity(item.id)} className="quantity-button">-</button>
									<button onClick={() => increaseQuantity(item.id)} className="quantity-button">+</button>
								</div>
							</div>
							<button className="remove-item-button" onClick={() => removeItem(item.id)}>Удалить</button>
						</div>
					))}
				</div>
			)}

			<div className="cart-summary">
				<p>
					<strong>Итого:</strong> {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)} ₽
				</p>
				<button className="checkout-button">Оформить заказ</button>
			</div>
		</div>
	);
}

export default Cart;
