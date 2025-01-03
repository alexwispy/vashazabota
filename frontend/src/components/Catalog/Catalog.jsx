import React, { useState, useEffect, useMemo } from 'react';
import './Catalog.css';
import ProductCard from '../ProductCard/ProductCard.jsx';
import Sidebar from '../../components/Sidebar/Sidebar';
import dataService from '../../services/dataService.js';

function ProductList() {
  const [products, setProducts] = useState([]); // Состояние для хранения данных продуктов
  const [categories, setCategories] = useState([]); // Состояние для категорий
  const [loading, setLoading] = useState(true); // Состояние для загрузки
  const [error, setError] = useState(null); // Состояние для ошибок
  const [selectedCategory, setSelectedCategory] = useState(null); // Выбранная категория
  const [minPrice, setMinPrice] = useState(0); // Минимальная цена
  const [maxPrice, setMaxPrice] = useState(1000); // Максимальная цена
  const [sortOption, setSortOption] = useState('default'); // Опция сортировки

  // Функция для получения данных продуктов и категорий
  const fetchData = async () => {
    try {
      const productsData = await dataService.getProducts();
      const categoriesData = await dataService.getCategories();

      setProducts(productsData);
      setCategories(categoriesData);

      // Определяем минимальную и максимальную цену из данных продуктов
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
  }, []); // Загружаем данные один раз при монтировании компонента

  // Фильтрация и сортировка продуктов
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(product =>
        Array.isArray(product.productCategory)
          ? product.productCategory.includes(selectedCategory)
          : product.productCategory === selectedCategory
      );
    }

    // Фильтрация по цене
    filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);

    // Сортировка
    if (sortOption === 'asc-price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'desc-price') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'asc-name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'desc-name') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    // Перемещаем товары с количеством меньше 1 в конец списка
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
