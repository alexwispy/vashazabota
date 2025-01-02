import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BrandList.css'; // Подключаем стили
import ProductCard from '../ProductCard/ProductCard'; // Импортируем компонент ProductCard

const BrandList = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/brands');
        if (!response.ok) {
          throw new Error('Не удалось загрузить бренды');
        }
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      const fetchProductsByBrand = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/products/brand/${selectedBrand}`);
          if (!response.ok) {
            throw new Error('Не удалось загрузить товары для выбранного бренда');
          }
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchProductsByBrand();
    }
  }, [selectedBrand]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (brands.length === 0) {
    return <p>Нет доступных брендов</p>;
  }

  if (selectedBrand && products.length === 0) {
    return <p>Товары для выбранного бренда не найдены</p>;
  }

  const handleCardClick = (productId) => {
    console.log('Product ID:', productId); // Логируем ID
    navigate(`/products/${productId}`); // Переход на страницу продукта
  };

  return (
    <div className="brand-list">
      <div className="brand-cards">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="brand-card"
            onClick={() => setSelectedBrand(brand)} // Устанавливаем выбранный бренд при клике
          >
            {brand}
          </div>
        ))}
      </div>

      {selectedBrand && (
        <div>
          <h2>Товары бренда {selectedBrand}</h2>
          <div className="product-list">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCardClick={handleCardClick} // Передаем обработчик клика
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandList;
