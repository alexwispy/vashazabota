import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import AddToCartButton from '../AddToCartButton/AddToCartButton';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleImageClick = (e) => {
    e.stopPropagation(); // Чтобы клик по изображению не срабатывал на родительский элемент
    navigate(`/products/${product.id}`); // Переход на страницу товара по ID
  };

  const productImage = product.img || '/images/products/default-image.jpg';
  const price = product.price ? `${product.price} ₽` : 'Цена не указана';

  return (
    <div className="product-card" onClick={handleImageClick}>
      <div className="product-image">
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
