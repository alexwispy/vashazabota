const getApiBaseUrl = () => {
	const hostname = window.location.hostname;
	const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
	const apiUrl = isLocalhost
		? 'http://localhost:5000' // для локального окружения
		: window.location.protocol === 'https:' // если сайт открыт через HTTPS
			? `https://${hostname}` // для продакшн-сервера через HTTPS
			: `http://${hostname}`; // для продакшн-сервера через HTTP

	return apiUrl;
};

// Функция для выполнения запроса с тайм-аутом
const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, { ...options, signal: controller.signal });
		clearTimeout(id);
		return response;
	} catch (error) {
		if (error.name === 'AbortError') {
			throw new Error('Запрос превысил время ожидания');
		}
		throw error;
	}
};

// Функция для получения всех продуктов с сервера
const fetchProductsFromServer = async () => {
	try {
		const apiUrl = getApiBaseUrl();
		const response = await fetchWithTimeout(`${apiUrl}/api/products`);
		if (!response.ok) {
			throw new Error(`Ошибка при получении данных с сервера: ${response.statusText}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Ошибка при получении данных с сервера:', error);
		return []; // Возвращаем пустой массив в случае ошибки
	}
};

// Функция для получения продукта по ID с сервера
const fetchProductByIdFromServer = async (id) => {
	try {
		const apiUrl = getApiBaseUrl();
		const response = await fetchWithTimeout(`${apiUrl}/api/products/${id}`);
		if (!response.ok) {
			throw new Error(`Ошибка при получении данных о продукте: ${response.statusText}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Ошибка при получении данных о продукте:', error);
		return null; // Возвращаем null, если продукт не найден
	}
};

// Функция для получения всех брендов с сервера
const fetchBrandsFromServer = async () => {
	try {
		const apiUrl = getApiBaseUrl();
		const response = await fetchWithTimeout(`${apiUrl}/api/brands`);
		if (!response.ok) {
			throw new Error(`Ошибка при получении брендов с сервера: ${response.statusText}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Ошибка при получении брендов с сервера:', error);
		return []; // Возвращаем пустой массив в случае ошибки
	}
};

// Функция для получения продуктов по бренду с сервера
const fetchProductsByBrandFromServer = async (brand) => {
	try {
		const apiUrl = getApiBaseUrl();
		const response = await fetchWithTimeout(`${apiUrl}/api/products/brand/${brand}`);
		if (!response.ok) {
			throw new Error(`Ошибка при получении продуктов для бренда: ${response.statusText}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Ошибка при получении продуктов для бренда:', error);
		return []; // Возвращаем пустой массив в случае ошибки
	}
};

// Функция для получения категорий с сервера
const fetchCategoriesFromServer = async () => {
	try {
		const apiUrl = getApiBaseUrl();
		const response = await fetchWithTimeout(`${apiUrl}/api/categories`);
		if (!response.ok) {
			throw new Error(`Ошибка при получении категорий с сервера: ${response.statusText}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Ошибка при получении категорий с сервера:', error);
		return []; // Возвращаем пустой массив в случае ошибки
	}
};

// Функция для отправки заказа на сервер
const sendOrderToServer = async (name, phone, product, address) => {
	try {
		const apiUrl = getApiBaseUrl();
		const response = await fetchWithTimeout(`${apiUrl}/api/order`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, phone, product, address }), // Передаем данные о заказе, включая адрес
		});

		if (!response.ok) {
			throw new Error(`Ошибка при отправке заказа: ${response.statusText}`);
		}

		return await response.json(); // Возвращаем ответ от сервера (например, успешное сообщение)
	} catch (error) {
		console.error('Ошибка при отправке заказа:', error);
		throw error; // Бросаем ошибку, чтобы можно было обработать ее в компоненте
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

const getCategories = async () => {
	return await fetchCategoriesFromServer();
};

// Экспортируем все методы в dataService
const dataService = {
	getProducts, // Получить все продукты
	getProductById, // Получить продукт по ID
	getBrands, // Получить все бренды
	getProductsByBrand, // Получить продукты по бренду
	getCategories, // Получить все категории
	sendOrderToServer, // Отправить заказ на сервер (с учетом имени, телефона, товара и адреса)
};

export default dataService; // Экспортируем объект dataService
