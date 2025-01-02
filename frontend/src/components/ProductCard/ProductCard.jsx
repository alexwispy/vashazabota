import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';
import AddToCartButton from '../AddToCartButton/AddToCartButton';

const ProductCard = ({ product }) => {
	const productImage = product.img || '/images/products/default-image.jpg';
	const price = product.price ? `${product.price} ₽` : 'Цена не указана';

	return (
		<div className="product-card">
			<Link to={`/products/${product.id}`} className="product-image-link">
				<div className="product-image">
					<img src={productImage} alt={product.name} className="product-image-img" />
				</div>
			</Link>
			<div className="product-info">
				<h3 className="product-title">{product.name}</h3>
				<p className="product-price">{price}</p>
			</div>
			<AddToCartButton />
		</div>
	);
};

export default ProductCard;
