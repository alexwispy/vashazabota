import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Catalog.css';
import ProductCard from '../ProductCard/ProductCard';
import SortFilter from '../SortFilter/SortFilter';
import PriceFilter from '../PriceFilter/PriceFilter';
import dataService from '../../services/dataService';
import MobileHeader from '../MobileHeader/MobileHeader';

const Catalog = () => {
	const navigate = useNavigate();

	// Данные по брендам, товарам и категориям
	const [brands, setBrands] = useState([]);
	const [productsByBrand, setProductsByBrand] = useState({});
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Фильтрация
	const [selectedBrands, setSelectedBrands] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [priceMin, setPriceMin] = useState(0);
	const [priceMax, setPriceMax] = useState(1000);
	const [sortOption, setSortOption] = useState('default');

	// Состояния для сайдбара и категорий
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [catalogExpanded, setCatalogExpanded] = useState(false);
	const [catListExpanded, setCatListExpanded] = useState(false);

	// Какие категории «открыты» (подкатегории видны)
	const [openCategories, setOpenCategories] = useState([]);

	const sidebarRef = useRef(null);
	const toggleButtonRef = useRef(null);

	// Загрузка данных
	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedBrands = await dataService.getBrands();
				setBrands(fetchedBrands);

				const products = await dataService.getProducts();
				const grouped = products.reduce((acc, product) => {
					const { brand, id } = product;
					if (!acc[brand]) acc[brand] = [];
					acc[brand].push({ ...product, key: id });
					return acc;
				}, {});
				setProductsByBrand(grouped);

				const fetchedCategories = await dataService.getCategories();
				setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);

				// min/max цены по всем товарам
				const prices = products.map((p) => p.price);
				if (prices.length) {
					setPriceMin(Math.min(...prices));
					setPriceMax(Math.max(...prices));
				}
			} catch (err) {
				console.error('Ошибка при загрузке данных:', err);
				setError(err.message || 'Ошибка загрузки данных');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// Если бренд приходит объектом { name: '...' }, достаём .name
	const getBrandKey = (brand) =>
		typeof brand === 'object' && brand !== null ? brand.name : brand;

	const handleCheckboxChange = (brand) => {
		const key = getBrandKey(brand);
		setSelectedBrands((prevSelected) =>
			prevSelected.includes(key)
				? prevSelected.filter((b) => b !== key)
				: [...prevSelected, key]
		);
	};

	// Открытие/закрытие категорий и установка выбранной
	const handleCategoryClick = (category) => {
		setOpenCategories((prev) =>
			prev.includes(category.parentCategory)
				? prev.filter((cat) => cat !== category.parentCategory)
				: [...prev, category.parentCategory]
		);
		// Если подкатегорий нет, сразу выбираем родительскую
		if (!category.subCategories?.length) {
			setSelectedCategory(category.parentCategory);
		}
	};

	const handleSubCategoryClick = (parentCategory, subCategory) => {
		setSelectedCategory(`${parentCategory}/${subCategory}`);
	};

	// Переход к странице товара
	const handleCardClick = (productId) => {
		navigate(`/products/${productId}`);
	};

	// Боковая панель (бургер-меню)
	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const toggleCatalogExpansion = () => {
		setCatalogExpanded(!catalogExpanded);
	};

	const toggleCatListExpansion = () => {
		setCatListExpanded(!catListExpanded);
	};

	// Закрываем сайдбар при клике вне
	const handleClickOutside = (event) => {
		if (
			sidebarRef.current &&
			!sidebarRef.current.contains(event.target) &&
			toggleButtonRef.current &&
			!toggleButtonRef.current.contains(event.target)
		) {
			setSidebarOpen(false);
		}
	};

	useEffect(() => {
		if (sidebarOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [sidebarOpen]);

	// Мемоизированная фильтрация + сортировка
	const filteredProducts = useMemo(() => {
		const allProducts = Object.values(productsByBrand).flat();
		let filtered = selectedBrands.length
			? selectedBrands.flatMap((brand) => productsByBrand[brand] || [])
			: allProducts;

		// Фильтрация по цене
		filtered = filtered.filter(
			(product) => product.price >= priceMin && product.price <= priceMax
		);

		// Фильтрация по категории
		if (selectedCategory) {
			filtered = filtered.filter((product) => {
				if (Array.isArray(product.productCategory)) {
					return product.productCategory.includes(selectedCategory);
				}
				return product.productCategory === selectedCategory;
			});
		}

		// Разделяем на "в наличии" и "нет в наличии"
		const inStock = filtered.filter((product) => product.quantity > 0);
		const outOfStock = filtered.filter((product) => product.quantity === 0);

		// Сортируем только "в наличии"
		if (sortOption === 'asc-price') {
			inStock.sort((a, b) => a.price - b.price);
		} else if (sortOption === 'desc-price') {
			inStock.sort((a, b) => b.price - a.price);
		} else if (sortOption === 'asc-name') {
			inStock.sort((a, b) => a.name.localeCompare(b.name));
		} else if (sortOption === 'desc-name') {
			inStock.sort((a, b) => b.name.localeCompare(a.name));
		}

		// Итог: сначала "в наличии", затем "нет в наличии"
		return [...inStock, ...outOfStock];
	}, [
		selectedBrands,
		productsByBrand,
		priceMin,
		priceMax,
		sortOption,
		selectedCategory
	]);

	if (loading) {
		return <div>Загрузка...</div>;
	}

	if (error) {
		return <div style={{ color: 'red' }}>Ошибка: {error}</div>;
	}

	return (
		<div className="catalog-container">
			<button
				ref={toggleButtonRef}
				className="sidebar-toggle"
				onClick={toggleSidebar}
			>
				{sidebarOpen ? '✕' : '☰'} Каталог
			</button>

			<div
				ref={sidebarRef}
				className={`brand-sidebar category-filter ${sidebarOpen ? 'open' : ''}`}
			>
				{/* Блок фильтра по цене */}
				<PriceFilter
					minPrice={priceMin}
					maxPrice={priceMax}
					onPriceChange={(newMin, newMax) => {
						// Убираем проверку (newMin !== 0)/(newMax !== 0)
						setPriceMin(newMin);
						setPriceMax(newMax);
					}}
				/>

				{/* Бренды */}
				<div className="brand-header sort-header" onClick={toggleCatalogExpansion}>
					<span>Бренды</span>
					<span className="sort-icon">{catalogExpanded ? '▲' : '▼'}</span>
				</div>
				{catalogExpanded && (
					<div className="brand-cards">
						{brands.map((brand) => {
							const key = getBrandKey(brand);
							return (
								<label key={key} className="category-item">
									<input
										type="checkbox"
										checked={selectedBrands.includes(key)}
										onChange={() => handleCheckboxChange(brand)}
									/>
									<span className="brand-name">{key}</span>
								</label>
							);
						})}
					</div>
				)}

				{/* Категории */}
				<div
					className="category-header sort-header"
					onClick={toggleCatListExpansion}
				>
					<span>Категории</span>
					<span className="sort-icon">{catListExpanded ? '▲' : '▼'}</span>
				</div>
				{catListExpanded && (
					<div className="category-cards">
						<ul className="category-list">
							{categories.map((category) => (
								<li key={category.parentCategory}>
									<div
										className="category-item"
										onClick={() => handleCategoryClick(category)}
										aria-expanded={openCategories.includes(category.parentCategory)}
									>
										<span>{category.parentCategory}</span>
										{category.subCategories?.length > 0 && (
											<span className="toggle-symbol">
												{openCategories.includes(category.parentCategory) ? '-' : '+'}
											</span>
										)}
									</div>
									{openCategories.includes(category.parentCategory) &&
										category.subCategories?.length > 0 && (
											<ul className="subcategories open">
												{category.subCategories.map((subCategory) => (
													<li key={subCategory}>
														<div
															className="subcategory-item"
															onClick={() =>
																handleSubCategoryClick(category.parentCategory, subCategory)
															}
														>
															{subCategory}
														</div>
													</li>
												))}
											</ul>
										)}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>

			<div className="product-list-container">
				{/* Сортировка (по цене или названию) */}
				<SortFilter onSortChange={setSortOption} />

				{/* Список товаров */}
				<div className="product-list">
					{filteredProducts.length ? (
						filteredProducts.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								onCardClick={handleCardClick}
							/>
						))
					) : (
						<p>Нет товаров для выбранных фильтров</p>
					)}
				</div>
			</div>
		</div>
	);
};


export default Catalog;
