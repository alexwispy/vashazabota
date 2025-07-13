import React from 'react';
import { HiAdjustments } from "react-icons/hi";
import './FilterButton.css'; // Импортируем стили

const FilterButton = ({ onFilterClick, sidebarOpen }) => {
	const handleClick = (e) => {
		e.preventDefault();
		console.log(`Filter button clicked, sidebar is ${sidebarOpen ? 'open' : 'closed'}`); // Отладочная информация
		onFilterClick(!sidebarOpen); // Переключаем состояние сайдбара
	};

	return (
		<button className="filter-button" onClick={handleClick}>
			<HiAdjustments className="icon" />
			<span className="label">{'Фильтры'}</span> {/* Меняем текст в зависимости от состояния */}
		</button>
	);
};

export default FilterButton;
