import React, { useState, useRef, useEffect } from 'react';
import './SortFilter.css';

const SortFilter = ({ onSortChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState('default');
	const sortRef = useRef(null);

	const options = [
		{ value: 'default', label: 'По умолчанию' },
		{ value: 'asc-price', label: 'Сначала дешевле' },
		{ value: 'desc-price', label: 'Сначала дороже' },
		{ value: 'asc-name', label: 'От А до Я' },
		{ value: 'desc-name', label: 'От Я до А' },
	];

	const handleOptionClick = (value) => {
		setSelectedOption(value);
		onSortChange(value);
		setIsOpen(false);
	};

	// Закрытие при клике вне компонента
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (sortRef.current && !sortRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div className="sort-filter" ref={sortRef}>
			<div
				className="sort-header"
				onClick={() => setIsOpen(!isOpen)}
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === 'Enter') setIsOpen(!isOpen);
				}}
			>
				<span>{options.find(option => option.value === selectedOption)?.label}</span>
				<span className="sort-icon">{isOpen ? '\u25B2' : '\u25BC'}</span>
			</div>
			{isOpen && (
				<ul className="sort-options">
					{options.map(option => (
						<li
							key={option.value}
							className={`sort-option ${option.value === selectedOption ? 'selected' : ''}`}
							onClick={() => handleOptionClick(option.value)}
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleOptionClick(option.value);
							}}
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SortFilter;
