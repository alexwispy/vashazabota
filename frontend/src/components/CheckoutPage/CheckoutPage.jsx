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
	const [notification, setNotification] = useState(null); // Состояние для уведомления
	const navigate = useNavigate(); // Инициализация useNavigate

	useEffect(() => {
		// Загружаем данные из localStorage (если они есть)
		const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
		setCartItems(storedCart);

		// Вычисляем общую сумму
		const totalAmount = storedCart.reduce((total, item) => total + item.price * item.quantity, 0);
		setTotal(totalAmount);
	}, []);

	// Функция для проверки правильности номера телефона
	const validatePhone = (phone) => {
		const phonePattern = /^\+?[1-9]\d{1,14}$/; // Проверка формата номера
		return phonePattern.test(phone);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		// Проверяем, что все поля заполнены
		if (!name || !phone || !address) {
			setNotification({ message: 'Пожалуйста, заполните все поля.', type: 'error' }); // Покажем ошибку
			return;
		}

		// Проверка правильности номера телефона
		if (!validatePhone(phone)) {
			setNotification({ message: 'Введите корректный номер телефона.', type: 'error' });
			return;
		}

		// Отправляем данные о заказе на сервер
		try {
			// Формируем массив объектов товаров с необходимыми полями
			const products = cartItems.map(item => ({
				name: item.name,
				quantity: item.quantity,
				price: item.price,
			}));

			// Отправляем данные заказа на сервер
			const response = await fetch('http://localhost:5000/api/order', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, phone, address, products, total }), // Теперь передаем массив товаров
			});

			if (!response.ok) {
				throw new Error('Ошибка при отправке данных');
			}

			// Показываем успешное уведомление
			setNotification({ message: 'Заказ успешно оформлен!', type: 'success' });

			// Очистка корзины после оформления заказа
			localStorage.removeItem('cart');
			setCartItems([]);
			setTotal(0);

			// Через 60 секунд (1 минута) редирект на главную
			const timer = setTimeout(() => {
				navigate('/'); // Перенаправляем на главную страницу
			}, 60000); // 60000 миллисекунд = 1 минута

			// Возвращаем функцию для очистки таймера, если пользователь закроет уведомление
			return () => clearTimeout(timer);
		} catch (error) {
			setNotification({ message: 'Произошла ошибка при оформлении заказа. Попробуйте снова.', type: 'error' }); // Ошибка
		}
	};

	// Функция для закрытия уведомления
	const handleCloseNotification = () => {
		setNotification(null);
		navigate('/'); // Редирект сразу после закрытия уведомления
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
						cartItems.map(item => (
							<div key={item.id} className="checkout-item">
								<img src={item.image} alt={item.name} className="checkout-item-image" />
								<div className="checkout-item-details">
									<p>{item.name}</p>
									<p>{item.quantity} x {item.price} ₽</p>
								</div>
							</div>
						))
					)}
				</div>

				<div className="checkout-total">
					<p><strong>Итого: </strong>{total} ₽</p>
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
				<div className="form-group">
					<label>Адрес:</label>
					<input
						type="text"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						required
					/>
				</div>
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

			{/* Отображение уведомлений */}
			{notification && (
				<Notification
					message={notification.message}
					type={notification.type}
					onClose={handleCloseNotification} // Добавим обработчик для закрытия уведомления
				/>
			)}
		</div>
	);
};

export default CheckoutPage;
