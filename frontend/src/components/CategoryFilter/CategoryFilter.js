import React, { useState, useEffect } from 'react';
import './CategoryFilter.css';

function CategoryFilter({ categories, onCategorySelect }) {
	const [openCategories, setOpenCategories] = useState([]);

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
