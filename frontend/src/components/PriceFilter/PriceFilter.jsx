import React, { useState, useEffect } from 'react';
import './PriceFilter.css';

const PriceFilter = ({ minPrice, maxPrice, onPriceChange }) => {
	const [openPrice, setOpenPrice] = useState(false);
	const [typingTimer, setTypingTimer] = useState(null); // Состояние для таймера

	// Функция для переключения состояния блока с ценами
	const togglePriceBlock = () => {
		setOpenPrice(!openPrice);  // переключаем отображение блока цен
	};

	// Функция для обработки изменения минимальной цены
	const handleMinPriceChange = (e) => {
		let value = e.target.value === '' ? '' : Number(e.target.value);

		// Устанавливаем минимальную цену
		onPriceChange(value, maxPrice);

		// Очистка таймера, если ввод продолжается
		if (typingTimer) {
			clearTimeout(typingTimer);
		}

		// Устанавливаем новый таймер для проверки через 3 секунды
		setTypingTimer(setTimeout(() => handleBlur(), 3000));
	};

	// Функция для обработки изменения максимальной цены
	const handleMaxPriceChange = (e) => {
		let value = e.target.value === '' ? '' : Number(e.target.value);

		// Устанавливаем максимальную цену
		onPriceChange(minPrice, value);

		// Очистка таймера, если ввод продолжается
		if (typingTimer) {
			clearTimeout(typingTimer);
		}

		// Устанавливаем новый таймер для проверки через 3 секунды
		setTypingTimer(setTimeout(() => handleBlur(), 3000));
	};

	// Функция для проверки и исправления значений после завершения ввода
	const handleBlur = () => {
		// Если минимальная цена больше максимальной, делаем максимальную цену равной минимальной
		if (maxPrice < minPrice && maxPrice !== '') {
			onPriceChange(minPrice, minPrice);
		}
	};

	// Очистка таймера при размонтировании компонента или изменении значений
	useEffect(() => {
		return () => {
			if (typingTimer) {
				clearTimeout(typingTimer);
			}
		};
	}, [typingTimer]);

	return (
		<div className="price-filter">
			<div className="price-item" onClick={togglePriceBlock}>
				<h4>Цена</h4>
				<span className="toggle-symbol">{openPrice ? "-" : "+"}</span>
			</div>
			<div className={`price-inputs ${openPrice ? 'open' : ''}`}>
				<div>
					<input
						type="number"
						value={minPrice === "" ? "" : minPrice}
						onChange={handleMinPriceChange}
						onBlur={handleBlur} // Проверка после завершения ввода
						placeholder="Минимальная цена"
					/>
				</div>
				<div>
					<input
						type="number"
						value={maxPrice === "" ? "" : maxPrice}
						onChange={handleMaxPriceChange}
						onBlur={handleBlur} // Проверка после завершения ввода
						placeholder="Максимальная цена"
					/>
				</div>
			</div>
		</div>
	);
};

export default PriceFilter;
