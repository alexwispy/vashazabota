import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import AddToCartButton from '../AddToCartButton/AddToCartButton';

const ProductCard = ({ product }) => {
	const navigate = useNavigate();
	const [imageError, setImageError] = useState(false);

	// API всегда работает на порту 5001
	const getApiBaseUrl = () => {
		const hostname = window.location.hostname;
		const protocol = window.location.protocol;
		return `${protocol}//${hostname}:5001`;
	};

	const handleImageClick = () => {
		navigate(`/products/${product.id}`, { state: { product, image: imageSrc } });
	};

	const productImage = `${getApiBaseUrl()}/images/${product.id}.webp`;
	const defaultImage = '/images/products/default-image.webp';

	const handleError = () => {
		setImageError(true);
	};

	const imageSrc = imageError ? defaultImage : productImage;

	// Оптимизировано отображение цены
	const price = product.salePrice || product.price ? `${product.salePrice || product.price} ₽` : 'Цена не указана';
	const originalPrice = product.salePrice && product.price ? `${product.price} ₽` : null;

	return (
		<div className="product-card">
			<div className="product-image">
				<img
					src={imageSrc}
					alt={product.name}
					className="product-image-img"
					onClick={handleImageClick}
					onError={handleError}
				/>
			</div>
			<div className="product-info">
				<h3 className="product-title">{product.name}</h3>
				<p className="product-price">
					{product.salePrice && product.price ? (
						<>
							<span className="product-price--sale">{price}</span>
							<span className="product-price--original">{originalPrice}</span>
						</>
					) : (
						price
					)}
				</p>
				<p className="product-brand">{product.brand}</p>
			</div>
			<AddToCartButton product={product} image={imageSrc} />
		</div>
	);
};

export default ProductCard;
