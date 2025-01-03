import React, { useState, useEffect } from 'react';
import './CategoryFilter.css';
import dataService from '../../services/dataService';

function CategoryFilter({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await dataService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Ошибка при загрузке категорий', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    if (openCategory === category) {
      setOpenCategory(null);  // Закрываем категорию
    } else {
      setOpenCategory(category);  // Открываем категорию
    }
  };

  const handleSubCategoryClick = (parentCategory, subCategory) => {
    onCategorySelect(`${parentCategory}/${subCategory}`);
  };

  return (
    <div className="category-filter">
      <h4>Категории</h4>
      <ul className="category-list">
        {categories.map((category, index) => (
          <li key={index}>
            <div className="category-item" onClick={() => handleCategoryClick(category.parentCategory)}>
              <span>{category.parentCategory}</span>
              <span className="toggle-symbol">
                {openCategory === category.parentCategory ? '-' : '+'}
              </span>
            </div>
            {openCategory === category.parentCategory && category.subCategories.length > 0 && (
              <ul className="subcategories open">
                {category.subCategories.map((subCategory, subIndex) => (
                  <li key={subIndex}>
                    <div
                      className="subcategory-item"
                      onClick={() => handleSubCategoryClick(category.parentCategory, subCategory)}
                    >
                      {subCategory}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryFilter;
