import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Catalog.css";
import ProductList from "../ProductList/ProductList";
import Sidebar from "../Sidebar/Sidebar";
import SortFilter from "../SortFilter/SortFilter";
import dataService from "../../services/dataService";
import FilterButton from "../FilterButton/FilterButton";
import Loader from "../Loader/Loader";

const Catalog = ({ sidebarOpen, setSidebarOpen }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const sidebarRef = useRef(null);

	const [brands, setBrands] = useState([]);
	const [categories, setCategories] = useState([]);
	const [productsByBrand, setProductsByBrand] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [selectedBrands, setSelectedBrands] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [filterPriceMin, setFilterPriceMin] = useState("");
	const [filterPriceMax, setFilterPriceMax] = useState("");
	const fixedPriceMin = 30;
	const fixedPriceMax = 5000;
	const [sortOption, setSortOption] = useState("default");

	// Получаем категорию из URL
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const categoryFromUrl = params.get("category");
		if (categoryFromUrl) {
			setSelectedCategory(categoryFromUrl);
		}
	}, [location]);

	// Закрытие сайдбара при клике вне его
	useEffect(() => {
		if (!sidebarOpen) return; // Если сайдбар закрыт — ничего не делаем

		const handleClickOutside = (event) => {
			if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
				setSidebarOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [sidebarOpen, setSidebarOpen]);

	// Получаем данные при загрузке
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [fetchedBrands, fetchedCategories, products] = await Promise.all([
					dataService.getBrands(),
					dataService.getCategories(),
					dataService.getProducts(),
				]);

				setBrands(fetchedBrands);
				setCategories(fetchedCategories);

				const grouped = products.reduce((acc, product) => {
					const { brand, id } = product;
					if (!acc[brand]) acc[brand] = [];
					acc[brand].push({ ...product, key: id });
					return acc;
				}, {});

				setProductsByBrand(grouped);
			} catch (err) {
				setError(err.message || "Ошибка загрузки данных");
			} finally {
				setTimeout(() => setLoading(false), 3000); // Гарантированное время анимации
			}
		};

		fetchData();
	}, []);

	// Фильтрация и сортировка товаров
	const filteredProducts = useMemo(() => {
		if (!productsByBrand) return [];

		let filtered = selectedBrands.length
			? selectedBrands.flatMap((brand) => productsByBrand[brand] || [])
			: Object.values(productsByBrand).flat();

		filtered = filtered.filter(
			(product) =>
				(filterPriceMin === "" ||
					product.price >= Math.max(filterPriceMin, fixedPriceMin)) &&
				(filterPriceMax === "" ||
					product.price <= Math.min(filterPriceMax, fixedPriceMax))
		);

		if (selectedCategory) {
			filtered = filtered.filter((product) =>
				Array.isArray(product.productCategory)
					? product.productCategory.includes(selectedCategory)
					: product.productCategory === selectedCategory
			);
		}

		const inStock = filtered.filter((product) => product.quantity > 0);
		const outOfStock = filtered.filter((product) => product.quantity === 0);

		if (sortOption === "asc-price") inStock.sort((a, b) => a.price - b.price);
		if (sortOption === "desc-price") inStock.sort((a, b) => b.price - a.price);
		if (sortOption === "asc-name")
			inStock.sort((a, b) => a.name.localeCompare(b.name));
		if (sortOption === "desc-name")
			inStock.sort((a, b) => b.name.localeCompare(a.name));

		return [...inStock, ...outOfStock];
	}, [
		selectedBrands,
		productsByBrand,
		filterPriceMin,
		filterPriceMax,
		selectedCategory,
		sortOption,
	]);

	// Показываем лоадер во время загрузки
	if (loading) return <Loader />;

	if (error) return <div style={{ color: "red" }}>Ошибка: {error}</div>;

	return (
		<div className="catalog-container">
			<Sidebar
				ref={sidebarRef}
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
				<div className="product-list-header">
					<SortFilter onSortChange={setSortOption} />
					<FilterButton
						sidebarOpen={sidebarOpen}
						onFilterClick={(newState) => setSidebarOpen(newState)}
					/>
				</div>
				<ProductList
					products={filteredProducts}
					onCardClick={(id) => navigate(`/products/${id}`)}
				/>
			</div>
		</div>
	);
};

export default Catalog;
