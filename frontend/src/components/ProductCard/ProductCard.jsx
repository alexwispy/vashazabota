import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Добавляем импорт useNavigate
import './ProductCard.css';
import AddToCartButton from '../AddToCartButton/AddToCartButton';

const ProductCard = ({ product }) => {
  const navigate = useNavigate(); // Создаем экземпляр navigate
  const [imageError, setImageError] = useState(false);  // Состояние для обработки ошибки загрузки изображения

  const handleImageClick = () => {
    const imageSrc = imageError ? '/images/products/default-image.webp' : `http://localhost:5000/images/${product.id}.webp`;
    navigate(`/products/${product.id}`, { state: { product, image: imageSrc } }); // Переход на страницу товара с передачей данных
  };

  // Формируем путь к изображению, используя ID продукта и добавляя .webp расширение
  const productImage = `http://localhost:5000/images/${product.id}.webp`;
  const defaultImage = '/images/products/default-image.webp'; // Путь к изображению по умолчанию

  // Функция для обработки ошибки загрузки изображения
  const handleError = () => {
    setImageError(true); // Если произошла ошибка, меняем состояние
  };

  // Если изображение с ошибкой, используем изображение по умолчанию
  const imageSrc = imageError ? defaultImage : productImage;

  const price = product.price ? `${product.price} ₽` : 'Цена не указана';

  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={imageSrc}  // Используем путь к изображению или дефолтное
          alt={product.name}
          className="product-image-img"
          onClick={handleImageClick}
          onError={handleError}  // Обработчик ошибки
        />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">{price}</p>
        <p className="product-brand">{product.brand}</p>
      </div>
      {/* Передаем путь к изображению в AddToCartButton */}
      <AddToCartButton product={product} image={imageSrc} />
    </div>
  );
};

export default ProductCard;
