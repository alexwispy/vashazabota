import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddToCartButton.css'; // Стили для кнопки

const AddToCartButton = ({ product }) => {
  const navigate = useNavigate();
  
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    // Проверяем, есть ли товар в корзине
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const isProductInCart = storedCart.some(item => item.id === product.id);
    setIsInCart(isProductInCart);
  }, [product.id]); // Запускаем useEffect при изменении product.id

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Останавливаем всплытие события при клике на кнопку

    if (isInCart) {
      // Если товар уже в корзине, переходим в корзину
      navigate('/cart');
    } else {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.img || '/images/products/default-image.jpg', // используем изображение по умолчанию, если его нет
        quantity: 1,
      };

      // Добавляем товар в корзину в localStorage
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      localStorage.setItem('cart', JSON.stringify([...storedCart, cartItem]));
      setIsInCart(true); // Обновляем состояние кнопки
    }
  };

  return (
    <button 
      className={`add-to-cart-button ${isInCart ? 'added' : ''}`} 
      onClick={handleAddToCart}
    >
      {isInCart ? 'В корзине' : 'Добавить в корзину'}
    </button>
  );
};

export default AddToCartButton;
