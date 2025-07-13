import React from 'react';
import { Link } from 'react-router-dom';
import './Categories.css';

const Categories = () => {
	return (
		<section className="categories">
			<h2 className="categories__title">Популярные категории</h2>
			<div className="categories__cards">
				<div className="categories__card">
					<Link to="#" className="categories__card-link">
						<img src="/images/products/skincare-icon.jpg" alt="Косметика для ухода за кожей" className="categories__card-img" />
						<h3 className="categories__card-title">Уход за кожей</h3>
					</Link>

				</div>
				<div className="categories__card">
					<Link to="#" className="categories__card-link">
						<img src="/images/products/bath-icon.jpg" alt="Товары для душа" className="categories__card-img" />
						<h3 className="categories__card-title">Все для душа</h3>
					</Link>
				</div>
				<div className="categories__card">
					<Link to="#" className="categories__card-link">
						<img src="/images/products/household-icon.jpg" alt="Хозяйственные товары" className="categories__card-img" />
						<h3 className="categories__card-title">Хозяйственные товары</h3>
					</Link>
				</div>
				<div className="categories__card">
					<Link to="#" className="categories__card-link">
						<img src="/images/products/bath-bombs-icon.jpg" alt="Бомбочки для ванн Ваша забота" className="categories__card-img" />
						<h3 className="categories__card-title">Ваша забота</h3>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Categories;
