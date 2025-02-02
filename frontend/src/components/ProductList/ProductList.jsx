import React from 'react';
import './ProductList.css';
import ProductCard from '../ProductCard/ProductCard';

const ProductList = ({ products, onCardClick }) => {
	return (
		<div className="product-list">
			{products.length ? (
				products.map((product) => (
					<ProductCard key={product.id} product={product} onCardClick={onCardClick} />
				))
			) : (
				<p>Нет товаров для выбранных фильтров</p>
			)}
		</div>
	);
};

export default ProductList;