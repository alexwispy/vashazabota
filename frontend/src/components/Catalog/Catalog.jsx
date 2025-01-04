import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import './Catalog.css';
import ProductCard from '../ProductCard/ProductCard.jsx';
import Sidebar from '../../components/Sidebar/Sidebar';
import dataService from '../../services/dataService.js';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortOption, setSortOption] = useState('default');

  // Получаем параметры URL
  const location = useLocation();

  // Функция для получения данных продуктов и категорий
  const fetchData = async () => {
    try {
      const productsData = await dataService.getProducts();
      const categoriesData = await dataService.getCategories();

      setProducts(productsData);
      setCategories(categoriesData);

      const prices = productsData.map(product => product.price);
      setMinPrice(Math.min(...prices));
      setMaxPrice(Math.max(...prices));

      setLoading(false);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      setError('Не удалось загрузить данные. Попробуйте снова позже.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Извлекаем параметр "category" из URL
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category'); // Получаем значение параметра category

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl); // Устанавливаем выбранную категорию
    }
  }, [location]);

  // Фильтрация продуктов по категории и цене
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(product =>
        Array.isArray(product.productCategory)
          ? product.productCategory.includes(selectedCategory)
          : product.productCategory === selectedCategory
      );
    }

    filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);

    if (sortOption === 'asc-price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'desc-price') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'asc-name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'desc-name') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    filtered.sort((a, b) => {
      if (a.quantity < 1 && b.quantity >= 1) return 1;
      if (a.quantity >= 1 && b.quantity < 1) return -1;
      return 0;
    });

    return filtered;
  }, [products, selectedCategory, minPrice, maxPrice, sortOption]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="catalog-container">
      <Sidebar
        categories={categories}
        onCategorySelect={setSelectedCategory}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={(newMin, newMax) => {
          setMinPrice(newMin);
          setMaxPrice(newMax);
        }}
        onSortChange={setSortOption}
      />
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>Нет товаров для выбранных фильтров</p>
        )}
      </div>
    </div>
  );
}

export default ProductList;

