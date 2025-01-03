import React, { useState, useEffect, useCallback } from 'react';
import './Catalog.css';
import ProductCard from '../ProductCard/ProductCard.jsx';
import Sidebar from '../../components/Sidebar/Sidebar'; // Импортируем Sidebar
import dataService from '../../services/dataService.js'; // Импортируем dataService

function ProductList() {
	const [products, setProducts] = useState([]); // Состояние для хранения данных продуктов
	const [filteredProducts, setFilteredProducts] = useState([]); // Отфильтрованные продукты
	const [categories, setCategories] = useState([]); // Состояние для категорий
	const [loading, setLoading] = useState(true); // Состояние для загрузки
	const [error, setError] = useState(null); // Состояние для ошибок
	const [selectedCategory, setSelectedCategory] = useState(null); // Выбранная категория
	const [minPrice, setMinPrice] = useState(0); // Минимальная цена
	const [maxPrice, setMaxPrice] = useState(1000); // Максимальная цена
	const [sortOption, setSortOption] = useState('default'); // Опция сортировки (по цене или наименованию)

	// Функция для получения продуктов с сервера
	const fetchProducts = useCallback(async () => {
		try {
			const productsData = await dataService.getProducts();
			setProducts(productsData);
			setFilteredProducts(productsData);

			// Определяем минимальную и максимальную цену из данных продуктов
			const prices = productsData.map(product => product.price);
			setMinPrice(Math.min(...prices));
			setMaxPrice(Math.max(...prices));

			setLoading(false);
		} catch (error) {
			console.error('Ошибка при получении данных:', error);
			setError('Не удалось загрузить продукты. Попробуйте снова позже.');
			setLoading(false);
		}
	}, []);

	// Функция для получения категорий
	const fetchCategories = async () => {
		try {
			const categoriesData = await dataService.getCategories();
			setCategories(categoriesData);
		} catch (error) {
			console.error('Ошибка при получении категорий:', error);
		}
	};

	// Функция для изменения цен
	const handlePriceChange = (newMinPrice, newMaxPrice) => {
		setMinPrice(newMinPrice);
		setMaxPrice(newMaxPrice);
	};

	// Функция для обработки сортировки
	const handleSortChange = (sortOrder) => {
		setSortOption(sortOrder);
	};

	// Загружаем все данные при монтировании компонента
	useEffect(() => {
		fetchProducts();
		fetchCategories();
	}, [fetchProducts]);

	// Фильтруем и сортируем продукты
	useEffect(() => {
		let filteredProducts = products;

		if (selectedCategory) {
			filteredProducts = filteredProducts.filter(product =>
				Array.isArray(product.productCategory)
					? product.productCategory.includes(selectedCategory)
					: product.productCategory === selectedCategory
			);
		}

		// Фильтрация по цене
		filteredProducts = filteredProducts.filter(product =>
			product.price >= minPrice && product.price <= maxPrice
		);

		// Сортировка
		if (sortOption === 'asc-price') {
			filteredProducts.sort((a, b) => a.price - b.price);
		} else if (sortOption === 'desc-price') {
			filteredProducts.sort((a, b) => b.price - a.price);
		} else if (sortOption === 'asc-name') {
			filteredProducts.sort((a, b) => a.name.localeCompare(b.name)); // Сортировка по возрастанию
		} else if (sortOption === 'desc-name') {
			filteredProducts.sort((a, b) => b.name.localeCompare(a.name)); // Сортировка по убыванию
		}

		setFilteredProducts([...filteredProducts]); // Обновляем отображаемые продукты, клонируем для избежания мутации
	}, [selectedCategory, minPrice, maxPrice, products, sortOption]);

	if (loading) {
		return <p>Загрузка...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<div className="catalog-container">
			<Sidebar
				categories={categories}
				onCategorySelect={setSelectedCategory}
				minPrice={minPrice}
				maxPrice={maxPrice}
				onPriceChange={handlePriceChange}
				onSortChange={handleSortChange}
			/>
			<div className="product-list">
				{filteredProducts.length > 0 ? (
					filteredProducts.map((product) => (
						<ProductCard
							key={product.id}
							product={{
								id: product.id,
								name: product.name,
								price: product.price,
								salePrice: product.salePrice,
								article: product.article,
								productCategory: product.productCategory,
								brand: product.brand,
								expirationDate: product.expirationDate,
								applicationMethod: product.applicationMethod,
								code: product.code,
								barcodes: product.barcodes,
								img: product.img,
								quantity: product.quantity
							}} // Передаем все необходимые данные в ProductCard
						/>
					))
				) : (
					<p>Нет товаров для выбранных фильтров</p>
				)}
			</div>
		</div>
	);
}

export default ProductList;
