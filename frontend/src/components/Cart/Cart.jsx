import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import { useCart } from '../CartContext/CartContext'; // Используем глобальное состояние корзины
import './Cart.css';

function Cart() {
  const navigate = useNavigate(); // Создаем экземпляр navigate
  const { updateCartCount } = useCart(); // Подключаем updateCartCount из контекста

  // Загружаем корзину из локального хранилища
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Функция для обновления глобального состояния корзины
  const updateCartState = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Обновляем localStorage
    updateCartCount(); // Обновляем глобальное состояние корзины
  };

  // Функция для удаления товара из корзины
  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    updateCartState(updatedCart);
  };

  // Функция для увеличения количества товара в корзине
  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id && item.orderQuantity < item.quantity) {
        return { ...item, orderQuantity: item.orderQuantity + 1 }; // Увеличиваем только если orderQuantity меньше quantity
      }
      return item;
    });
    updateCartState(updatedCart);
  };

  // Функция для уменьшения количества товара в корзине
  const decreaseQuantity = (id) => {
    const updatedCart = cartItems.map(item => 
      item.id === id && item.orderQuantity > 1 ? { ...item, orderQuantity: item.orderQuantity - 1 } : item
    );
    updateCartState(updatedCart);
  };

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
              <img 
                src={item.image ? item.image : '/images/products/default-image.webp'} // Используем переданное изображение или стандартное
                alt={item.name} 
                className="cart-item-image" 
              />
              <div className="cart-item-details">
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-price">{item.price} ₽</p>
                <p className="cart-item-quantity">Количество: {item.orderQuantity}</p>
                <div className="quantity-controls">
                  <button 
                    onClick={() => decreaseQuantity(item.id)} 
                    className="quantity-button"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => increaseQuantity(item.id)} 
                    className="quantity-button"
                    disabled={item.orderQuantity >= item.quantity} // Отключаем кнопку, если orderQuantity >= quantity
                  >
                    +
                  </button>
                </div>
              </div>
              <button className="remove-item-button" onClick={() => removeItem(item.id)}>Удалить</button>
            </div>
          ))}
        </div>
      )}

      <div className="cart-summary">
        <p>
          <strong>Итого:</strong> {cartItems.reduce((total, item) => total + item.price * item.orderQuantity, 0)} ₽
        </p>
        <button className="checkout-button" onClick={handleCheckout}>
          Оформить заказ
        </button>
      </div>
    </div>
  );
}

export default Cart;
