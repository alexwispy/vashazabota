// src/components/HomePage/HomePage.jsx
import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Секция главного баннера */}
      <section className="main-banner">
        <h1>Добро пожаловать в наш магазин косметики</h1>
        <p>Мы предлагаем только качественные и проверенные продукты для заботы о вашей красоте и здоровье.</p>
      </section>

      {/* Секция "О магазине" */}
      <section className="about">
        <h2>О магазине</h2>
        <p>
          Мы — ваш надежный партнер в мире косметики и ухода. Наш магазин предоставляет косметические средства
          высочайшего качества, привезенные из Таиланда, а также лучшие продукты для повседневного ухода.
        </p>
      </section>

      {/* Секция "Наши главные бренды" */}
      <section className="brands">
        <h2>Наши главные бренды</h2>
        <p>Мы — производители и импортеры продукции известных брендов, таких как:</p>
        <p><strong>Ваша забота</strong> — производители</p>
        <p><strong>Cathy Doll</strong> — импортеры</p>
      </section>
    </div>
  );
};

export default HomePage;
