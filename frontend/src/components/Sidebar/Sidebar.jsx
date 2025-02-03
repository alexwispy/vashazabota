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
		<div className={`brand-sidebar ${sidebarOpen ? 'open' : ''}`}>
			{/* Общий контейнер для всего содержимого */}
			<div className="sidebar-wrapper">
				{/* Кнопка очистки фильтров */}
				<div className="sidebar-footer">
					<button className="sidebar-clear-filters" onClick={clearFilters}>
						Очистить фильтры
					</button>
				</div>

				{/* Контейнер для фильтров */}
				<div className="sidebar-content">
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
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
