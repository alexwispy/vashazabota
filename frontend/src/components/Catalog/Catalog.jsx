import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Catalog.css';
import ProductList from '../ProductList/ProductList';
import Sidebar from '../Sidebar/Sidebar';
import SidebarToggleButton from '../SidebarToggleButton/SidebarToggleButton';
import SortFilter from '../SortFilter/SortFilter';
import dataService from '../../services/dataService';

const Catalog = () => {
	const navigate = useNavigate();

	// Состояния для данных
	const [brands, setBrands] = useState([]);
	const [categories, setCategories] = useState([]);
	const [productsByBrand, setProductsByBrand] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Фильтры
	const [selectedBrands, setSelectedBrands] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [filterPriceMin, setFilterPriceMin] = useState('');
	const [filterPriceMax, setFilterPriceMax] = useState('');
	const fixedPriceMin = 30;
	const fixedPriceMax = 5000;
	const [sortOption, setSortOption] = useState('default');

	// Состояния сайдбара
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Загрузка данных
	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedBrands = await dataService.getBrands();
				setBrands(fetchedBrands);

				const fetchedCategories = await dataService.getCategories();
				setCategories(fetchedCategories);

				const products = await dataService.getProducts();
				const grouped = products.reduce((acc, product) => {
					const { brand, id } = product;
					if (!acc[brand]) acc[brand] = [];
					acc[brand].push({ ...product, key: id });
					return acc;
				}, {});
				setProductsByBrand(grouped);
			} catch (err) {
				console.error('Ошибка загрузки:', err);
				setError(err.message || 'Ошибка загрузки данных');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// Фильтрация и сортировка
	const filteredProducts = useMemo(() => {
		const allProducts = Object.values(productsByBrand).flat();
		let filtered = selectedBrands.length
			? selectedBrands.flatMap((brand) => productsByBrand[brand] || [])
			: allProducts;

		// Фильтр по цене
		filtered = filtered.filter(
			(product) => (filterPriceMin === '' || product.price >= Math.max(filterPriceMin, fixedPriceMin)) &&
				(filterPriceMax === '' || product.price <= Math.min(filterPriceMax, fixedPriceMax))
		);

		// Фильтр по категории
		if (selectedCategory) {
			filtered = filtered.filter((product) =>
				Array.isArray(product.productCategory)
					? product.productCategory.includes(selectedCategory)
					: product.productCategory === selectedCategory
			);
		}

		// Разделяем товары на «в наличии» и «нет в наличии»
		const inStock = filtered.filter((product) => product.quantity > 0);
		const outOfStock = filtered.filter((product) => product.quantity === 0);

		// Сортировка
		if (sortOption === 'asc-price') inStock.sort((a, b) => a.price - b.price);
		if (sortOption === 'desc-price') inStock.sort((a, b) => b.price - a.price);
		if (sortOption === 'asc-name') inStock.sort((a, b) => a.name.localeCompare(b.name));
		if (sortOption === 'desc-name') inStock.sort((a, b) => b.name.localeCompare(a.name));

		return [...inStock, ...outOfStock];
	}, [selectedBrands, productsByBrand, filterPriceMin, filterPriceMax, sortOption, selectedCategory]);

	if (loading) return <div>Загрузка...</div>;
	if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;

	return (
		<div className="catalog-container">
			
			<Sidebar
				brands={brands}
				categories={categories}
				selectedBrands={selectedBrands}
				selectedCategory={selectedCategory}
				setSelectedBrands={setSelectedBrands}
				setSelectedCategory={setSelectedCategory}
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
				priceMin={filterPriceMin || fixedPriceMin}
				priceMax={filterPriceMax || fixedPriceMax}
				setPriceMin={setFilterPriceMin}
				setPriceMax={setFilterPriceMax}
				fixedPriceMin={fixedPriceMin}
				fixedPriceMax={fixedPriceMax}
			/>
			<div className="product-list-container">
				<SortFilter onSortChange={setSortOption} />
				<ProductList products={filteredProducts} onCardClick={(id) => navigate(`/products/${id}`)} />
			</div>
		</div>
	);
};

export default Catalog;
