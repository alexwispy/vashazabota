import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BrandList.css';
import ProductCard from '../ProductCard/ProductCard';
import dataService from '../../services/dataService';

const BrandList = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [productsByBrand, setProductsByBrand] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedBrands = await dataService.getBrands();
        setBrands(fetchedBrands);

        const products = await dataService.getProducts();
        const groupedProducts = products.reduce((acc, product) => {
          const { brand, id } = product;
          if (!acc[brand]) {
            acc[brand] = [];
          }
          acc[brand].push({ ...product, key: id }); // Привязываем ключ к id
          return acc;
        }, {});
        setProductsByBrand(groupedProducts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      console.log(`Выбран бренд: ${selectedBrand}`);
    }
  }, [selectedBrand]);

  const handleCardClick = (productId) => {
    console.log('Product ID:', productId);
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (brands.length === 0) {
    return <p>Нет доступных брендов</p>;
  }

  if (selectedBrand && (!productsByBrand[selectedBrand] || productsByBrand[selectedBrand].length === 0)) {
    return <p>Товары для выбранного бренда не найдены</p>;
  }

  return (
    <div className="brand-list">
      <div className="brand-cards">
        {brands.map((brand) => (
          <div
            key={brand}
            className="brand-card"
            onClick={() => setSelectedBrand(brand)}
          >
            {brand}
          </div>
        ))}
      </div>

      {selectedBrand && (
        <div>
          <h2>Товары бренда {selectedBrand}</h2>
          <div className="product-list">
            {(productsByBrand[selectedBrand] || []).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandList;
