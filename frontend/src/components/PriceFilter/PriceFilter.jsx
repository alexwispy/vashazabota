import React, { useState } from 'react';
import './PriceFilter.css';

const PriceFilter = ({ minPrice, maxPrice, onPriceChange }) => {
	const [open, setOpen] = useState(false);
	const [tempMin, setTempMin] = useState('');
	const [tempMax, setTempMax] = useState('');

	const toggleOpen = () => setOpen(!open);

	const handleMinPriceChange = (e) => {
		setTempMin(e.target.value);
	};

	const handleMaxPriceChange = (e) => {
		setTempMax(e.target.value);
	};

	const handleBlur = () => {
		let min = Number(tempMin) || minPrice;
		let max = Number(tempMax) || maxPrice;

		if (min > max) {
			min = max;
		}

		onPriceChange(min, max);
	};

	return (
		<div className="price-filter">
			<div className="price-filter__header" onClick={toggleOpen}>
				<h4>Цена</h4>
				<span className={`price-filter__icon ${open ? 'price-filter__icon--open' : ''}`}>
					▼
				</span>
			</div>
			<div className={`price-filter__inputs ${open ? 'price-filter__inputs--open' : ''}`}>
				<input
					type="number"
					className="price-filter__input"
					value={tempMin}
					onChange={handleMinPriceChange}
					onBlur={handleBlur}
					placeholder={`Мин`}
				/>
				<input
					type="number"
					className="price-filter__input"
					value={tempMax}
					onChange={handleMaxPriceChange}
					onBlur={handleBlur}
					placeholder={`Макс`}
				/>
			</div>
		</div>
	);
};

export default PriceFilter;
