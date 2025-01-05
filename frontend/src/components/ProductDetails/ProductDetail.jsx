import React from 'react';
import { useLocation } from 'react-router-dom'; // Для получения состояния
import AddToCartButton from '../AddToCartButton/AddToCartButton'; // Подключаем компонент кнопки
import './ProductDetail.css'; // Стили для карточки товара

const ProductDetail = () => {
  const location = useLocation(); // Получаем location, чтобы получить данные, переданные через state
  const product = location.state?.product; // Извлекаем продукт из state
  const imageSrc = location.state?.image; // Получаем imageSrc из state, который передаем через AddToCartButton

  // Если продукт не передан через пропсы
  if (!product) {
    return <div>Продукт не найден</div>;
  }

  // Формируем путь к изображению, если оно не передано
  const productImage = imageSrc || '/images/products/default-image.jpg'; 

  // Определяем цену
  const price = product.salePrice ? `${product.salePrice} ₽` : (product.price ? `${product.price} ₽` : 'Цена не указана');
  const originalPrice = product.price && product.salePrice ? `${product.price} ₽` : null;

  return (
    <div className="product-detail">
      <div className="product-detail__image">
        <img
          src={productImage}  // Используем картинку из пропсов
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

        {/* Цена и скидка */}
        <div className="product-detail__price">
          {product.salePrice && originalPrice ? (
            <>
              <span className="product-detail__price-sale">{price}</span>
              <span className="product-detail__price-original">{originalPrice}</span>
            </>
          ) : (
            price
          )}
        </div>

        <div className="product-detail__add-to-cart">
          {/* Передаем imageSrc в AddToCartButton */}
          <AddToCartButton product={product} image={productImage} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
