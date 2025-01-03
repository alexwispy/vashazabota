import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Для получения параметра ID из URL
import AddToCartButton from '../AddToCartButton/AddToCartButton'; // Подключаем компонент кнопки
import './ProductDetail.css'; // Стили для карточки товара
import dataService from '../../services/dataService'; // Импортируем dataService

const ProductDetail = () => {
	const { id } = useParams(); // Получаем ID продукта из URL
	const [product, setProduct] = useState(null); // Состояние для хранения продукта
	const [loading, setLoading] = useState(true); // Состояние для загрузки
	const [error, setError] = useState(null); // Состояние для ошибок

	// Запрос данных о продукте по ID
	useEffect(() => {
		const fetchProduct = async () => {
			setLoading(true);
			setError(null);

			try {
				const data = await dataService.getProductById(id); // Используем dataService для получения данных
				if (!data) {
					throw new Error('Продукт не найден');
				}
				setProduct(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id]); // Завершаем загрузку данных при изменении ID

	if (loading) {
		return <div>Загрузка...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	if (!product) {
		return <div>Продукт не найден</div>;
	}

	// Отображаем карточку товара
	return (
		<div className="product-detail">
			<div className="product-detail__image">
				<img
					src={product.img || '/images/products/default-image.jpg'}
					alt={product.name}
					className="product-detail__image-img"
				/>
			</div>

			<div className="product-detail__info">
				<h2 className="product-detail__title">{product.name}</h2>
				<p className="product-detail__brand">{product.brand}</p>

				{/* Описание продукта */}
				<div className="product-detail__section">
					<h3>Описание</h3>
					<p>{product.description || 'Описание отсутствует'}</p>
				</div>

				{/* Способ применения */}
				<div className="product-detail__section">
					<h3>Способ применения</h3>
					<p>{product.applicationMethod || 'Способ применения не указан'}</p>
				</div>

				{/* Состав */}
				<div className="product-detail__section">
					<h3>Состав</h3>
					<p>{product.composition || 'Состав не указан'}</p>
				</div>

				<p className="product-detail__price">{product.price} ₽</p>

				<div className="product-detail__add-to-cart">
					<AddToCartButton product={product} />
				</div>
			</div>
		</div>
	);
};

export default ProductDetail;
