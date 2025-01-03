import React, { useState } from 'react';
import './Notification.css';

const Notification = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Функция для закрытия уведомления
  const handleClose = () => {
    setIsVisible(false);
    onClose(); // Вызываем onClose для дополнительной логики, если нужно
  };

  if (!isVisible) return null; // Не отображаем компонент, если уведомление закрыто

  return (
    <div className={`notification ${type}`}>
      <div className="notification-content">
        <p>{message}</p>
      </div>
      <button className="close-button" onClick={handleClose}>×</button>
    </div>
  );
};

export default Notification;
