import React from 'react';
import './MainBanner.css';

const MainBanner = () => {
	return (
		<section className="main-banner">
			<div className="main-banner__image-wrapper">
				<img
					src="/images/products/default-mainBaner.jpg"
					alt="Акция на корейскую косметику"
					className="main-banner__image"
				/>
			</div>
			<div className="main-banner__content">
				<h1 className="main-banner__title">Скидки на косметику!</h1>
				<p className="main-banner__subtitle">
					Только в феврале - скидки до 30% на популярные товары.
				</p>
				<a href="/products?category=Распродажа" className="main-banner__button">
					Посмотреть товары
				</a>
			</div>
		</section>
	);
};

export default MainBanner;
