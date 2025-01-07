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
	const [pickup, setPickup] = useState(false); // Добавлено состояние для самовывоза
	const [notification, setNotification] = useState(null); // Состояние для уведомления
	const navigate = useNavigate(); // Инициализация useNavigate

	useEffect(() => {
		// Загружаем данные из localStorage (если они есть)
		const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
		setCartItems(storedCart);

		// Вычисляем общую сумму
		const totalAmount = storedCart.reduce((total, item) => total + item.price * item.orderQuantity, 0); // Используем orderQuantity
		setTotal(totalAmount);
	}, []);

	// Функция для проверки правильности номера телефона
	const validatePhone = (phone) => {
		const phonePattern = /^\+?[1-9]\d{1,14}$/; // Проверка формата номера
		return phonePattern.test(phone);
	};

	// Функция для получения базового URL API
	const getApiBaseUrl = () => {
		const hostname = window.location.hostname;
		const protocol = window.location.protocol;
		const port = hostname === 'localhost' ? 3001 : 5001; // Используем порт 3001 для локального сервера и 5001 для продакшн

		return `${protocol}//${hostname}:${port}`;
	};

	// Функция для обработки отправки формы
	const handleSubmit = async (event) => {
		event.preventDefault();

		// Проверяем, что все поля заполнены
		if (!name || !phone || (!pickup && !address)) { // Проверяем, если самовывоз не выбран, то адрес обязателен
			setNotification({ message: 'Пожалуйста, заполните все поля.', type: 'error' }); // Покажем ошибку
			return;
		}

		// Убираем все нецифровые символы из номера телефона и обрабатываем, чтобы оставалось 11 цифр
		let formattedPhone = phone.replace(/\D/g, ''); // Удаляем все символы, кроме цифр

		// Убедимся, что номер состоит из 11 цифр
		if (formattedPhone.length < 11) {
			// Добавляем недостающие цифры
			while (formattedPhone.length < 11) {
				formattedPhone = '0' + formattedPhone;
			}
		} else if (formattedPhone.length > 11) {
			// Обрезаем до 11 цифр
			formattedPhone = formattedPhone.slice(0, 11);
		}

		// Проверка правильности номера телефона
		if (!validatePhone(formattedPhone)) {
			setNotification({ message: 'Введите корректный номер телефона.', type: 'error' });
			return;
		}

		// Отправляем данные о заказе на сервер
		try {
			// Формируем массив объектов товаров с необходимыми полями
			const products = cartItems.map(item => ({
				name: item.name,
				quantity: item.orderQuantity, // Используем orderQuantity
				price: item.price,
			}));

			const apiUrl = getApiBaseUrl(); // Получаем базовый URL API

			// Отправляем данные заказа на сервер
			const response = await fetch(`${apiUrl}/api/order`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					phone: formattedPhone,
					address: pickup ? 'Самовывоз' : address, // Передаем 'Самовывоз', если выбран самовывоз
					products,
					total
				}), // Передаем адрес или самовывоз в зависимости от флага
			});

			if (!response.ok) {
				throw new Error('Ошибка при отправке данных');
			}

			// Показываем успешное уведомление
			setNotification({ message: 'Заказ успешно оформлен!', type: 'success' });

			// Очистка корзины и формы после оформления заказа
			localStorage.removeItem('cart');
			setCartItems([]);
			setTotal(0);
			setName(''); // Очищаем поле имени
			setPhone(''); // Очищаем поле телефона
			setAddress(''); // Очищаем поле адреса

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
									<p>{item.orderQuantity} x {item.price} ₽</p> {/* Используем orderQuantity */}
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
				{/* Переключатель для самовывоза */}
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
				{/* Если самовывоз не выбран, показываем поле для адреса */}
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
