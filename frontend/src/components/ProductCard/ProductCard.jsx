import React from 'react';
import { useNavigate } from 'react-router-dom'; // Добавляем импорт useNavigate
import './ProductCard.css';
import AddToCartButton from '../AddToCartButton/AddToCartButton';

const ProductCard = ({ product }) => {
	const navigate = useNavigate(); // Создаем экземпляр navigate

	const handleImageClick = () => {
		navigate(`/products/${product.id}`, { state: { product } }); // Переход на страницу товара по ID с передачей продукта через state
	};

	const productImage = product.img || '/images/products/default-image.jpg';
	const price = product.price ? `${product.price} ₽` : 'Цена не указана';

	return (
		<div className="product-card">
			<div className="product-image">
				<img
					src={productImage}
					alt={product.name}
					className="product-image-img"
					onClick={handleImageClick}
				/>
			</div>
			<div className="product-info">
				<h3 className="product-title">{product.name}</h3>
				<p className="product-price">{price}</p>
				<p className="product-brand">{product.brand}</p>
			</div>
			{/* Передаем product в AddToCartButton */}
			<AddToCartButton product={product} />
		</div>
	);
};

export default ProductCard;
