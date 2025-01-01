import React from 'react';
import './BrandList.css'; // Подключаем стили

const BrandList = () => {
	// Статический список брендов
	const brands = [
		'Cathy Doll', 'Singi', 'Masil', 'Ayoume', 'Pond\'s', 'Yourcare - Ваша забота',
		'Mistine', 'Enough', 'Jigott', 'JMsolution', 'Kokliang', 'Derma Factory',
		'Mukunghwa', 'Coco blues', 'Welcos', 'Giffarine', 'It\'s Me', 'Garglin',
		'Baby Bright', 'Lolane', 'Carebeau', 'Sungbo Cleamy', 'Hygiene', 'Yoko'
	];

	return (
		<div className="brand-list">
			<h2>Бренды</h2>
			<div className="brand-cards">
				{brands.length === 0 ? (
					<p>Нет доступных брендов</p>
				) : (
					brands.map((brand, index) => (
						<div key={index} className="brand-card">
							{brand}
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default BrandList;
