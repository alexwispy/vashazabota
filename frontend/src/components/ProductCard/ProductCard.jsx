import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import AddToCartButton from '../AddToCartButton/AddToCartButton';

const ProductCard = ({ product }) => {
	const navigate = useNavigate();
	const [imageError, setImageError] = useState(false);

	const getApiBaseUrl = () => {
		const hostname = window.location.hostname;
		const protocol = window.location.protocol;
		const port = hostname === 'localhost' ? 3001 : 5001; // Используем порт 3001 для локального сервера и 5001 для продакшн

		return `${protocol}//${hostname}:${port}`;
	};

	const handleImageClick = () => {
		const imageSrc = imageError ? '/images/products/default-image.webp' : `${getApiBaseUrl()}/images/${product.id}.webp`;
		navigate(`/products/${product.id}`, { state: { product, image: imageSrc } });
	};

	const productImage = `${getApiBaseUrl()}/images/${product.id}.webp`;
	const defaultImage = '/images/products/default-image.webp';

	const handleError = () => {
		setImageError(true);
	};

	const imageSrc = imageError ? defaultImage : productImage;

	const price = product.salePrice ? `${product.salePrice} ₽` : (product.price ? `${product.price} ₽` : 'Цена не указана');
	const originalPrice = product.price && product.salePrice ? `${product.price} ₽` : null;

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
					{product.salePrice && originalPrice ? (
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