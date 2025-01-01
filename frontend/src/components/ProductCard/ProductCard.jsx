import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import AddToCartButton from '../AddToCartButton/AddToCartButton';

const ProductCard = ({ product }) => {
	const navigate = useNavigate();

	// Переход на страницу товара по клику
	const handleCardClick = () => {
		navigate(`/products/${product.id}`);
	};

	// Если нет изображения, используем картинку по умолчанию
	const productImage = product.img || '/images/products/default-image.jpg';

	// Получение цены
	const price = product.price ? `${product.price} ₽` : 'Цена не указана';

	return (
		<div className="product-card">
			<div className="product-image" onClick={handleCardClick}>
				<img src={productImage} alt={product.name} className="product-image-img" />
			</div>
			<div className="product-info">
				<h3 className="product-title">{product.name}</h3>
				<p className="product-price">{price}</p>
			</div>
			<AddToCartButton />
		</div>
	);
};

export default ProductCard;
