import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Для получения параметра ID из URL
import AddToCartButton from '../AddToCartButton/AddToCartButton'; // Подключаем компонент кнопки
import './ProductDetail.css'; // Стили для карточки товара

const ProductDetail = () => {
  const { id } = useParams(); // Получаем ID продукта из URL
  const [product, setProduct] = useState(null); // Состояние для хранения продукта
  const [loading, setLoading] = useState(true); // Состояние для загрузки
  const [error, setError] = useState(null); // Состояние для ошибок

  // Запрос данных о продукте по ID
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Продукт не найден');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Продукт не найден</div>;
  }

  // Отображаем карточку товара
  return (
    <div className="product-detail">
      <div className="product-detail__image">
        <img
          src={product.img || '/images/products/default-image.jpg'} // Показываем изображение
          alt={product.name}
          className="product-detail__image-img"
        />
      </div>

      <div className="product-detail__info">
        <h2 className="product-detail__title">{product.name}</h2>
        <p className="product-detail__brand">{product.brand}</p> {/* Отображаем бренд */}
        <p className="product-detail__description">{product.description}</p>
        <p className="product-detail__price">{product.price} ₽</p> {/* Отображаем цену */}
        
        {/* Кнопка добавления в корзину */}
        <div className="product-detail__add-to-cart">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
