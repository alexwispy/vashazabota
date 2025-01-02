// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import './CheckoutPage.css'; // Стили для страницы оформления заказа

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Загружаем данные из localStorage (если они есть)
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);

    // Вычисляем общую сумму
    const totalAmount = storedCart.reduce((total, item) => total + item.price * item.quantity, 0);
    setTotal(totalAmount);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Тут можно добавить обработку отправки данных формы
    alert('Заказ оформлен!');
  };

  return (
    <div className="checkout-page">
      <h2>Оформление заказа</h2>

      <div className="checkout-summary">
        <h3>Ваши товары:</h3>
        <div className="checkout-items">
          {cartItems.length === 0 ? (
            <p>Корзина пуста</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="checkout-item">
                <img src={item.image} alt={item.name} className="checkout-item-image" />
                <div className="checkout-item-details">
                  <p>{item.name}</p>
                  <p>{item.quantity} x {item.price} ₽</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="checkout-total">
          <p><strong>Итого: </strong>{total} ₽</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label>Имя:</label>
          <input type="text" required />
        </div>
        <div className="form-group">
          <label>Адрес:</label>
          <input type="text" required />
        </div>
        <div className="form-group">
          <label>Телефон:</label>
          <input type="text" required />
        </div>
        <button type="submit" className="submit-button">Подтвердить заказ</button>
      </form>
    </div>
  );
};

export default CheckoutPage;
