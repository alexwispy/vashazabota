import React from 'react';
import './ProductCard.css'; // Подключаем стили
import AddToCartButton from '../AddToCartButton/AddToCartButton'; // Подключаем компонент кнопки

const ProductCard = ({ product }) => {
	const productImage = product.image || '/images/products/default-image.jpg'; // Если нет изображения, используем картинку по умолчанию

	return (
		<div className="product-card">
			<div className="product-image">
				<img
					src={productImage}
					alt={product.name}
					className="product-image-img"
				/>
			</div>

			<div className="product-info">
				<h3 className="product-title">{product.name}</h3>
				<p className="product-price">
					{product.salePrices?.[0]?.value ? `${product.salePrices[0].value} ₽` : 'Цена не указана'}
				</p> {/* Отображаем цену */}
			</div>

			{/* Передаем onAddToCart, а не onClick */}
			<AddToCartButton />
		</div>
	);
};

export default ProductCard;
