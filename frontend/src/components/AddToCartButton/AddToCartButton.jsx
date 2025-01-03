import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate для перехода на страницу корзины
import './AddToCartButton.css';

const AddToCartButton = ({ product }) => {
  const navigate = useNavigate(); // Создаем экземпляр navigate
  const [isInCart, setIsInCart] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(0);

  useEffect(() => {
    // Проверяем, есть ли товар в корзине
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const productInCart = savedCart.find(item => item.id === product.id);
    if (productInCart) {
      setIsInCart(true);
      setOrderQuantity(productInCart.orderQuantity); // Загружаем количество из корзины
    }
  }, [product.id]);

  const handleAddToCart = () => {
    // Если товар уже в корзине, переходим в корзину
    if (isInCart) {
      navigate('/cart');
      return;
    }

    // Если товара нет в наличии или количество заказа превышает доступное, ничего не делаем
    if (product.quantity < 1 || orderQuantity >= product.quantity) return;

    // Если товара нет в корзине, добавляем его в корзину
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.img || '/images/products/default-image.jpg',
      quantity: product.quantity, // Общее количество товара
      orderQuantity: 1, // Начальное количество товара в корзине
    };

    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...savedCart.filter(item => item.id !== product.id), cartItem]; // Обновляем корзину
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    setIsInCart(true); // Сразу обновляем состояние на "в корзине"
    setOrderQuantity(1); // Устанавливаем количество товара в корзине равным 1

    console.log("Товар добавлен в корзину:", cartItem); // Логируем товар, который добавляется в корзину
    console.log("Обновленная корзина:", updatedCart); // Логируем обновленную корзину
  };

  return (
    <button
      className={`add-to-cart-button ${isInCart ? 'added' : ''} ${product.quantity < 1 ? 'out-of-stock' : ''}`}
      onClick={handleAddToCart}
      disabled={product.quantity < 1} // Отключаем кнопку, если нет товара
    >
      {product.quantity < 1 ? 'Нет в наличии' : isInCart ? 'В корзине' : 'Добавить в корзину'}
    </button>
  );
};

export default AddToCartButton;
