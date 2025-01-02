import React, { useState, useEffect } from 'react';
import './BrandList.css'; // Подключаем стили

const BrandList = () => {
	// Состояние для хранения списка брендов
	const [brands, setBrands] = useState([]);
	const [loading, setLoading] = useState(true); // Состояние для загрузки
	const [error, setError] = useState(null); // Состояние для ошибок

	// Запрос к API для получения списка брендов
	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const response = await fetch('http://localhost:5000/api/brands'); // Замените на правильный эндпоинт
				if (!response.ok) {
					throw new Error('Не удалось загрузить бренды');
				}
				const data = await response.json();
				setBrands(data); // Записываем бренды в состояние
			} catch (error) {
				setError(error.message); // Если ошибка, записываем ее в состояние
			} finally {
				setLoading(false); // Завершаем загрузку
			}
		};

		fetchBrands(); // Вызов функции для получения брендов
	}, []); // Пустой массив зависимостей означает, что запрос будет сделан только один раз при монтировании компонента

	// Если идет загрузка, показываем индикатор
	if (loading) {
		return <div>Загрузка...</div>;
	}

	// Если произошла ошибка
	if (error) {
		return <div>{error}</div>;
	}

	// Если бренды не найдены
	if (brands.length === 0) {
		return <p>Нет доступных брендов</p>;
	}

	return (
		<div className="brand-list">
			<h2>Бренды</h2>
			<div className="brand-cards">
				{brands.map((brand, index) => (
					<div key={index} className="brand-card">
						{brand}
					</div>
				))}
			</div>
		</div>
	);
};

export default BrandList;
