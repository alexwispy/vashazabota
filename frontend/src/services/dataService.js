const fetchProductsFromServer = async () => {
	try {
		const response = await fetch('http://localhost:5000/api/products');
		if (!response.ok) {
			throw new Error('Ошибка при получении данных с сервера');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Ошибка при получении данных с сервера:', error);
		return [];
	}
};

const fetchProductByIdFromServer = async (id) => {
	try {
		const response = await fetch(`http://localhost:5000/api/products/${id}`);
		if (!response.ok) {
			throw new Error('Ошибка при получении данных о продукте');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Ошибка при получении данных о продукте:', error);
		return null;
	}
};

const fetchBrandsFromServer = async () => {
	try {
		const response = await fetch('http://localhost:5000/api/brands');
		if (!response.ok) {
			throw new Error('Ошибка при получении брендов с сервера');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Ошибка при получении брендов с сервера:', error);
		return [];
	}
};

const fetchProductsByBrandFromServer = async (brand) => {
	try {
		const response = await fetch(`http://localhost:5000/api/products/brand/${brand}`);
		if (!response.ok) {
			throw new Error('Ошибка при получении продуктов для бренда');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Ошибка при получении продуктов для бренда:', error);
		return [];
	}
};

// Новый метод для получения категорий
const fetchCategoriesFromServer = async () => {
	try {
		const response = await fetch('http://localhost:5000/api/categories');
		if (!response.ok) {
			throw new Error('Ошибка при получении категорий с сервера');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Ошибка при получении категорий с сервера:', error);
		return [];
	}
};

// Обработчики для получения данных с сервера
const getProducts = async () => {
	return await fetchProductsFromServer();
};

const getProductById = async (id) => {
	return await fetchProductByIdFromServer(id);
};

const getBrands = async () => {
	return await fetchBrandsFromServer();
};

const getProductsByBrand = async (brand) => {
	return await fetchProductsByBrandFromServer(brand);
};

// Новый метод для получения категорий
const getCategories = async () => {
	return await fetchCategoriesFromServer();
};

// Экспортируем сервис
const dataService = {
	getProducts,
	getProductById,
	getBrands,
	getProductsByBrand,
	getCategories,  // Добавили метод для получения категорий
};

export default dataService;
