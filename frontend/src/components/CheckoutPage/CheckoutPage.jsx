import React, { useState, useEffect } from 'react';
import './CheckoutPage.css';
import Notification from '../Notification/Notification';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext/CartContext';
import dataService from '../../services/dataService';


const CheckoutPage = () => {
	const [cartItems, setCartItems] = useState([]);
	const [total, setTotal] = useState(0);
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [pickup, setPickup] = useState(false);
	const [notification, setNotification] = useState(null);
	const navigate = useNavigate();
	const { clearCart } = useCart();

	const FREE_DELIVERY_THRESHOLD = 2500; // Порог для бесплатной доставки
	const DELIVERY_FEE = 200; // Стоимость доставки

	useEffect(() => {
		const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
		setCartItems(storedCart);

		const totalAmount = storedCart.reduce((total, item) => total + item.price * item.orderQuantity, 0);
		setTotal(totalAmount);
	}, []);

	const deliveryFee = !pickup && total < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
	const remainingForFreeDelivery = FREE_DELIVERY_THRESHOLD - total > 0 ? FREE_DELIVERY_THRESHOLD - total : 0;

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!name || !phone || (!pickup && !address)) {
			setNotification({ message: 'Пожалуйста, заполните все поля.', type: 'error' });
			return;
		}

		const products = cartItems.map((item) => ({
			name: item.name,
			quantity: item.orderQuantity,
			price: item.price,
		}));

		if (!pickup && deliveryFee > 0) {
			products.push({
				name: 'Доставка',
				quantity: 1,
				price: DELIVERY_FEE,
			});
		}

		const totalAddress = pickup ? 'Самовывоз' : address;
		const totalPrice = total + deliveryFee; // считаем итоговую сумму

		const orderData = { name, phone, address: totalAddress, products, total: totalPrice };

		console.log('Отправляем заказ:', JSON.stringify(orderData, null, 2)); // проверяем перед отправкой

		try {
			const response = await dataService.sendOrderToServer(name, phone, products, totalAddress, totalPrice);
			setNotification({ message: 'Заказ успешно оформлен!', type: 'success' });
			clearCart();
			setCartItems([]);
			setTotal(0);
			setName('');
			setPhone('');
			setAddress('');
			setTimeout(() => navigate('/'), 60000);
		} catch (error) {
			console.error('Ошибка оформления заказа:', error);
			setNotification({ message: 'Произошла ошибка при оформлении заказа. Попробуйте снова.', type: 'error' });
		}
	};


	const handleCloseNotification = () => {
		setNotification(null);
		navigate('/');
	};

	return (
		<div className="checkout-page">
			<h2>Оформление заказа</h2>

			<div className="checkout-summary">
				<h3>Ваши товары:</h3>
				<div className="checkout-items">
					{cartItems.length === 0 ? (
						<p>Корзина пуста</p>
					) : (
						cartItems.map((item) => (
							<div key={item.id} className="checkout-item">
								<img src={item.image} alt={item.name} className="checkout-item-image" />
								<div className="checkout-item-details">
									<p>{item.name}</p>
									<p>{item.orderQuantity} x {item.price} ₽</p>
								</div>
							</div>
						))
					)}
				</div>

				<div className="checkout-total">

					{!pickup && deliveryFee > 0 && (
						<p>
							<strong>Доставка: </strong>{DELIVERY_FEE} ₽{' '}
							<span>(До бесплатной доставки: {remainingForFreeDelivery} ₽)</span>
						</p>
					)}
					<p>
						<strong>Итого: </strong>{total + deliveryFee} ₽
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="checkout-form">
				<div className="form-group">
					<label>Имя:</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className="form-group checkbox-group">
					<label>
						<input
							type="checkbox"
							checked={pickup}
							onChange={() => setPickup(!pickup)}
						/>
						Самовывоз
					</label>
				</div>
				{!pickup && (
					<div className="form-group">
						<label>Адрес пвз:</label>
						<input
							type="text"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							required
						/>
					</div>
				)}
				<div className="form-group">
					<label>Телефон:</label>
					<input
						type="text"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="submit-button">Подтвердить заказ</button>
			</form>

			{notification && (
				<Notification
					message={notification.message}
					type={notification.type}
					onClose={handleCloseNotification}
				/>
			)}
		</div>
	);
};

export default CheckoutPage;
