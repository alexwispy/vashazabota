import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SidebarToggleButton.css';

const SidebarToggleButton = ({ sidebarOpen, setSidebarOpen }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate('/products'); // Переход на страницу каталога
		setSidebarOpen(true);   // Открытие сайдбара
	};

	return (
		<button className="sidebar-toggle__button" onClick={handleClick}>
			<span className="sidebar-toggle__icon">{sidebarOpen ? '✕' : '☰'}</span>
			<span className="sidebar-toggle__text">Каталог</span>
		</button>
	);
};

export default SidebarToggleButton;

//<SidebarToggleButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />