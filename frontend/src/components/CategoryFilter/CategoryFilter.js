import React, { useState, useEffect } from 'react';
import './CategoryFilter.css';
import dataService from '../../services/dataService';

function CategoryFilter({ onCategorySelect }) {
    const [categories, setCategories] = useState([]);
    const [openCategories, setOpenCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Получаем данные категорий через сервис
                const categoriesData = await dataService.getCategories();
                setCategories(categoriesData); // Сохраняем категории в состояние
            } catch (error) {
                console.error('Ошибка при загрузке категорий', error); // Логирование ошибки при загрузке
            }
        };

        fetchCategories(); // Вызов функции для получения категорий
    }, []); // Эффект запускается только один раз при монтировании компонента

    const handleCategoryClick = (category) => {
        // Если категория уже открыта, закрываем её, иначе открываем
        setOpenCategories((prevState) =>
            prevState.includes(category.parentCategory)
                ? prevState.filter((cat) => cat !== category.parentCategory) // Закрыть категорию
                : [...prevState, category.parentCategory] // Открыть категорию
        );

        // Если нет подкатегорий, передаем родительскую категорию
        if (!category.subCategories.length) {
            onCategorySelect(category.parentCategory);
        }
    };

    const handleSubCategoryClick = (parentCategory, subCategory) => {
        // Передаем выбранную категорию и подкатегорию в родительский компонент
        onCategorySelect(`${parentCategory}/${subCategory}`);
    };

    return (
        <div className="category-filter">
            <h4>Категории</h4>
            <ul className="category-list">
                {categories.map((category) => (
                    <li key={category.parentCategory}>
                        <div
                            className="category-item"
                            onClick={() => handleCategoryClick(category)}
                            aria-expanded={openCategories.includes(category.parentCategory)}
                        >
                            <span>{category.parentCategory}</span>
                            {category.subCategories.length > 0 && (
                                <span className="toggle-symbol">
                                    {openCategories.includes(category.parentCategory) ? '-' : '+'}
                                </span>
                            )}
                        </div>

                        {openCategories.includes(category.parentCategory) && category.subCategories.length > 0 && (
                            <ul className="subcategories open">
                                {category.subCategories.map((subCategory) => (
                                    <li key={subCategory}>
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
