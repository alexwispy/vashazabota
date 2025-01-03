import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import CategoryFilter from '../CategoryFilter/CategoryFilter';
import PriceFilter from '../PriceFilter/PriceFilter';
import SortFilter from '../SortFilter/SortFilter';
import dataService from '../../services/dataService';

const Sidebar = ({
	onCategorySelect,
	minPrice,
	maxPrice,
	onPriceChange,
	onSortChange,
}) => {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const categoriesData = await dataService.getCategories();
				setCategories(categoriesData);
				setLoading(false);
			} catch (error) {
				setError('Ошибка при загрузке категорий');
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	if (loading) {
		return <div>Загрузка категорий...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<div className="sidebar">
			{/* Вставляем компонент сортировки */}
			<SortFilter onSortChange={onSortChange} />

			{/* Вставляем компонент фильтра по цене */}
			<PriceFilter minPrice={minPrice} maxPrice={maxPrice} onPriceChange={onPriceChange} />

			{/* Вставляем компонент фильтра по категориям */}
			<CategoryFilter
				categories={categories}
				onCategorySelect={onCategorySelect}
			/>
		</div>
	);
};

export default Sidebar;
