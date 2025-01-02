// src/components/Cart/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import './Cart.css';

function Cart() {
  const navigate = useNavigate(); // Создаем экземпляр navigate

  // Загружаем корзину из локального хранилища
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Функция для удаления товара из корзины
  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
  };

  // Функция для увеличения количества товара
  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
  };

  // Функция для уменьшения количества товара
  const decreaseQuantity = (id) => {
    const updatedCart = cartItems.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCartItems(updatedCart);
  };

  // Обновляем локальное хранилище каждый раз, когда cartItems изменяется
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Обработчик перехода на страницу оформления заказа
  const handleCheckout = () => {
    navigate('/checkout'); // Переход на страницу оформления заказа
  };

  return (
    <div className="cart">
      <h2>Корзина</h2>

      {cartItems.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-price">{item.price} ₽</p>
                <p className="cart-item-quantity">Количество: {item.quantity}</p>
                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(item.id)} className="quantity-button">-</button>
                  <button onClick={() => increaseQuantity(item.id)} className="quantity-button">+</button>
                </div>
              </div>
              <button className="remove-item-button" onClick={() => removeItem(item.id)}>Удалить</button>
            </div>
          ))}
        </div>
      )}

      <div className="cart-summary">
        <p>
          <strong>Итого:</strong> {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)} ₽
        </p>
        <button className="checkout-button" onClick={handleCheckout}>
          Оформить заказ
        </button>
      </div>
    </div>
  );
}

export default Cart;
