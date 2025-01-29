import React from 'react';
import './RecommendedProducts.css';

const RecommendedProducts = () => {
  return (
    <section className="recommended-products">
      <h2>Рекомендуемые товары</h2>
      <div className="product-list">
        <div className="product-card">
          <img src="product1.jpg" alt="Популярный продукт 1" />
          <p>Крем для лица с экстрактом зелёного чая</p>
        </div>
        <div className="product-card">
          <img src="product2.jpg" alt="Популярный продукт 2" />
          <p>Молочко для тела с увлажняющим эффектом</p>
        </div>
        <div className="product-card">
          <img src="product3.jpg" alt="Популярный продукт 3" />
          <p>Шампунь для волос с японскими экстрактами</p>
        </div>
      </div>
    </section>
  );
};

export default RecommendedProducts;
