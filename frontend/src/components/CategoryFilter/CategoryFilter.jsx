import React, { useState, useEffect } from 'react';
import './CategoryFilter.css';

function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  const [openCategories, setOpenCategories] = useState([]);

  useEffect(() => {
    // Закрываем все категории, если выбранная категория сбрасывается
    if (selectedCategory === null) {
      setOpenCategories([]);
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setOpenCategories((prev) =>
      prev.includes(category.parentCategory)
        ? prev.filter((cat) => cat !== category.parentCategory)
        : [...prev, category.parentCategory]
    );

    if (!category.subCategories?.length) {
      setSelectedCategory(category.parentCategory);
    }
  };

  const handleSubCategoryClick = (parentCategory, subCategory) => {
    setSelectedCategory(`${parentCategory}/${subCategory}`);
  };

  return (
    <div className="category-filter">
      <h4 className="category-filter__title">Категории</h4>
      <ul className="category-filter__list">
        {categories.map((category) => (
          <li key={category.parentCategory} className="category-filter__item">
            <div
              className="category-filter__parent"
              onClick={() => handleCategoryClick(category)}
              aria-expanded={openCategories.includes(category.parentCategory)}
            >
              <span>{category.parentCategory}</span>
              {category.subCategories?.length > 0 && (
                <span className="category-filter__toggle">
                  {openCategories.includes(category.parentCategory) ? '-' : '+'}
                </span>
              )}
            </div>

            {openCategories.includes(category.parentCategory) && category.subCategories?.length > 0 && (
              <ul className="category-filter__subcategories">
                {category.subCategories.map((subCategory) => (
                  <li key={subCategory} className="category-filter__subitem">
                    <div
                      className="category-filter__sub"
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
