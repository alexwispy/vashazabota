import React from 'react';
import './SortFilter.css';

const SortFilter = ({ onSortChange }) => {
	return (
		<div className="sort-filter">
			<h4>Сортировать</h4>
			<select onChange={(e) => onSortChange(e.target.value)} defaultValue="default">
				<option value="default">По умолчанию</option>
				<option value="asc-price">От дешевых к дорогим</option>
				<option value="desc-price">От дорогих к дешевым</option>
				<option value="asc-name">От А до Я</option>
				<option value="desc-name">От Я до А</option>
			</select>
		</div>
	);
};

export default SortFilter;
