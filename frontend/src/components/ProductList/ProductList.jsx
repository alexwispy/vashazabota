import React, { useState, useEffect } from 'react';
import './ProductList.css';
import ProductCard from '../ProductCard/ProductCard.jsx';
import dataService from '../../services/dataService'; // Импортируем наш dataService

function ProductList() {
	const [products, setProducts] = useState([]); // Состояние для хранения данных продуктов
	const [loading, setLoading] = useState(true); // Состояние для загрузки
	const [error, setError] = useState(null); // Состояние для ошибок

	// Функция для получения продуктов с сервера или из локального хранилища
	const fetchProducts = async () => {
		try {
			const products = await dataService.getProducts(); // Получаем продукты
			setProducts(products); // Устанавливаем продукты в состояние
			setLoading(false); // Меняем состояние загрузки
		} catch (error) {
			console.error('Ошибка при получении данных:', error);
			setError('Не удалось загрузить продукты. Попробуйте снова позже.');
			setLoading(false);
		}
	};

	// Вызываем fetchProducts при монтировании компонента
	useEffect(() => {
		fetchProducts();
	}, []); // Пустой массив зависимостей гарантирует вызов только один раз

	if (loading) {
		return <p>Загрузка...</p>; // Показываем сообщение о загрузке
	}

	if (error) {
		return <p>{error}</p>; // Показываем ошибку, если она есть
	}

	return (
		<div className="product-list">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} /> // Используем компонент карточки
			))}
		</div>
	);
}

export default ProductList;
