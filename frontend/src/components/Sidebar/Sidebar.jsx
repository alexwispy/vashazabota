import React from 'react';
import './Sidebar.css';
import CategoryFilter from '../CategoryFilter/CategoryFilter';
import PriceFilter from '../PriceFilter/PriceFilter';
import SortFilter from '../SortFilter/SortFilter';

const Sidebar = ({
	categories,
	onCategorySelect,
	minPrice,
	maxPrice,
	onPriceChange,
	onSortChange,
}) => {
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
