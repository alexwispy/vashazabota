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
		<>
			{/*
        1) «Подложка» (overlay), которая видна, когда sidebarOpen === true.
           При клике на неё — закрываем сайдбар
       */}
			{sidebarOpen && (
				<div
					className="sidebar-overlay"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/*
        2) Сам сайдбар.
           Внутренний клик НЕ должен закрывать сайдбар, 
           поэтому на .sidebar-wrapper (или .brand-sidebar) 
           добавляем onClick={e => e.stopPropagation()}.
       */}
			<div
				className={`brand-sidebar ${sidebarOpen ? 'open' : ''}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="sidebar-wrapper">
					<div className="sidebar-content">
						<PriceFilter
							minPrice={priceMin}
							maxPrice={priceMax}
							onPriceChange={(min, max) => {
								setPriceMin(min);
								setPriceMax(max);
							}}
						/>
						<BrandFilter
							brands={brands}
							selectedBrands={selectedBrands}
							setSelectedBrands={setSelectedBrands}
						/>
						<CategoryFilter
							categories={categories}
							selectedCategory={selectedCategory}
							setSelectedCategory={setSelectedCategory}
						/>

						<div className="sidebar-footer">
							<button className="sidebar-clear-filters" onClick={clearFilters}>
								Очистить фильтры
							</button>
							<button
								className="sidebar-apply-filters"
								onClick={() => setSidebarOpen(false)}
							>
								Применить
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
