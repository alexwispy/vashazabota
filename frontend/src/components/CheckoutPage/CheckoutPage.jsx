import React, { useState, useEffect } from 'react';
import './CheckoutPage.css'; // Стили для страницы оформления заказа
import Notification from '../Notification/Notification'; // Импортируем компонент уведомлений
import { useNavigate } from 'react-router-dom'; // Используем useNavigate вместо useHistory

const CheckoutPage = () => {
	const [cartItems, setCartItems] = useState([]);
	const [total, setTotal] = useState(0);
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [pickup, setPickup] = useState(false);
	const [notification, setNotification] = useState(null);
	const navigate = useNavigate();

	const FREE_DELIVERY_THRESHOLD = 2500; // Порог для бесплатной доставки (изменено)
	const DELIVERY_FEE = 200; // Стоимость доставки

	useEffect(() => {
		// Загружаем данные из localStorage (если они есть)
		const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
		setCartItems(storedCart);

		// Вычисляем общую сумму
		const totalAmount = storedCart.reduce((total, item) => total + item.price * item.orderQuantity, 0);
		setTotal(totalAmount);
	}, []);

	// Рассчитываем стоимость доставки (только если самовывоз не выбран)
	const deliveryFee = !pickup && total < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;

	// Функция для обработки отправки формы
	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!name || !phone || (!pickup && !address)) {
			setNotification({ message: 'Пожалуйста, заполните все поля.', type: 'error' });
			return;
		}

		try {
			// Формируем массив товаров
			const products = cartItems.map((item) => ({
				name: item.name,
				quantity: item.orderQuantity,
				price: item.price,
			}));

			// Добавляем доставку в заказ, если она применяется
			if (!pickup && deliveryFee > 0) {
				products.push({
					name: 'Доставка',
					quantity: 1,
					price: DELIVERY_FEE,
				});
			}

			const response = await fetch(`/api/order`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					phone,
					address: pickup ? 'Самовывоз' : address,
					products,
					total: pickup ? total : total + deliveryFee, // Не добавляем доставку в total при самовывозе
				}),
			});

			if (!response.ok) {
				throw new Error('Ошибка при отправке данных');
			}

			setNotification({ message: 'Заказ успешно оформлен!', type: 'success' });
			localStorage.removeItem('cart');
			setCartItems([]);
			setTotal(0);
			setName('');
			setPhone('');
			setAddress('');
			setTimeout(() => navigate('/'), 60000);
		} catch (error) {
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
					<p><strong>Итого: </strong>{total} ₽</p>
					
					{/* Выводим доставку только если не выбран самовывоз */}
					{!pickup && deliveryFee > 0 && (
						<p>
							Доставка: {DELIVERY_FEE} ₽. До бесплатной доставки нужно до заказать на {FREE_DELIVERY_THRESHOLD - total} ₽.
						</p>
					)}

					{/* Выводим общую сумму только если самовывоз НЕ выбран */}
					{!pickup && (
						<p><strong>Общая сумма: </strong>{total + deliveryFee} ₽</p>
					)}
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
						<label>Адрес:</label>
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
