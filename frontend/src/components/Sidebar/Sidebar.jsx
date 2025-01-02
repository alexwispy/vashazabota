import React from 'react';
import './Sidebar.css';

function Sidebar({
	categories,
	onCategorySelect,
	minPrice,
	maxPrice,
	onPriceChange,
	onSortChange,
	minPriceInList, // Реальная минимальная цена из прайса
	maxPriceInList  // Реальная максимальная цена из прайса
}) {
	const handleMinPriceChange = (e) => {
		const value = e.target.value === '' ? '' : Number(e.target.value);

		// Если минимальная цена меньше минимальной из прайса, устанавливаем ее на минимальную цену из прайса
		if (value !== '' && value < minPriceInList) {
			onPriceChange(minPriceInList, maxPrice); // Устанавливаем минимальную цену на минимальную из прайса
		}
		// Если минимальная цена больше максимальной, устанавливаем ее равной максимальной
		else if (value !== '' && value > maxPrice) {
			onPriceChange(maxPrice, maxPrice); // Устанавливаем минимальную цену равной максимальной
		} else {
			onPriceChange(value, maxPrice); // Устанавливаем минимальную цену
		}
	};

	const handleMaxPriceChange = (e) => {
		const value = e.target.value === '' ? '' : Number(e.target.value);

		// Если максимальная цена стерта, она равна минимальной цене
		if (value === '') {
			onPriceChange(minPrice, minPrice); // Устанавливаем максимальную цену равной минимальной
		}
		// Если максимальная цена меньше минимальной, устанавливаем ее равной минимальной
		else if (value < minPrice) {
			onPriceChange(minPrice, minPrice); // Устанавливаем максимальную цену равной минимальной
		} else {
			onPriceChange(minPrice, value); // Устанавливаем максимальную цену
		}
	};

	return (
		<div className="sidebar">
			<div className="sidebar-section">
				<h4>Категории</h4>
				<ul className="sidebar-list">
					{categories.map((category) => (
						<li
							key={category}
							className="sidebar-item"
							onClick={() => onCategorySelect(category)}
						>
							{category}
						</li>
					))}
				</ul>
			</div>

			{/* Секция сортировки */}
			<div className="sidebar-section">
				<h4>Сортировать</h4>
				<select onChange={(e) => onSortChange(e.target.value)} defaultValue="default">
					<option value="default">По умолчанию</option>
					<option value="asc-price">От дешевых к дорогим</option>
					<option value="desc-price">От дорогих к дешевым</option>
					<option value="asc-name">От А до Я</option>
					<option value="desc-name">От Я до А</option>
				</select>
			</div>

			<div className="sidebar-section">
				<h4>Цена</h4>
				<div>
					<input
						type="number"
						value={minPrice === '' ? '' : minPrice}
						onChange={handleMinPriceChange}
						placeholder="Минимальная цена"
					/>
				</div>
				<div>
					<input
						type="number"
						value={maxPrice === '' ? '' : maxPrice}
						onChange={handleMaxPriceChange}
						placeholder="Максимальная цена"
					/>
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
