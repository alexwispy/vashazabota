import React from 'react';
import './Sidebar.css';
import BrandFilter from '../BrandFilter/BrandFilter';
import CategoryFilter from '../CategoryFilter/CategoryFilter';
import PriceFilter from '../PriceFilter/PriceFilter';

const Sidebar = ({
	brands,
	categories,
	selectedBrands,
	selectedCategory,
	setSelectedBrands,
	setSelectedCategory,
	sidebarOpen,
	setSidebarOpen,
	priceMin,
	priceMax,
	setPriceMin,
	setPriceMax,
	fixedPriceMin,
	fixedPriceMax,
}) => {
	const clearFilters = () => {
		setSelectedBrands([]);
		setSelectedCategory(null);
		setPriceMin(fixedPriceMin);
		setPriceMax(fixedPriceMax);
	};

	return (
		<div className={`brand-sidebar category-filter ${sidebarOpen ? 'open' : ''}`}>
			<button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>

			{/* Фильтр по цене */}
			<PriceFilter
				minPrice={priceMin}
				maxPrice={priceMax}
				onPriceChange={(min, max) => {
					setPriceMin(min);
					setPriceMax(max);
				}}
			/>

			{/* Фильтр по брендам */}
			<BrandFilter
				brands={brands}
				selectedBrands={selectedBrands}
				setSelectedBrands={setSelectedBrands}
			/>

			{/* Фильтр по категориям */}
			<CategoryFilter
				categories={categories}
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
			/>

			{/* Кнопка очистки фильтров */}
			<button className="sidebar-clear-filters" onClick={clearFilters}>
				Очистить фильтры
			</button>
		</div>
	);
};

export default Sidebar;
