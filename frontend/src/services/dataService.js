// Функция для получения базового URL API (всегда на 5001)
const getApiBaseUrl = () => {
	const hostname = window.location.hostname;
	const protocol = window.location.protocol;

	// Продакшен всегда использует порт 5001
	const apiPort = 5001;

	// Формируем URL с учетом порта
	return `${protocol}//${hostname}:${apiPort}`;
};

// Функция для выполнения запроса с тайм-аутом
const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);

	try {
		const headers = {
			'Content-Type': 'application/json',
			...(options.headers || {}), // Добавляем переданные заголовки
		};

		const response = await fetch(url, { ...options, headers, signal: controller.signal });
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
		return [];
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
		return null;
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
		return [];
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
		return [];
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
		return [];
	}
};

// Функция для отправки заказа на сервер
const sendOrderToServer = async (name, phone, products, address, total) => {
	try {
		const apiUrl = getApiBaseUrl();
		const orderData = { name, phone, products, address, total };
		const response = await fetchWithTimeout(`${apiUrl}/api/order`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(orderData),
		});

		if (!response.ok) {
			throw new Error(`Ошибка при отправке заказа: ${response.statusText}`);
		}

		// Проверяем, что сервер действительно вернул JSON
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			return await response.json(); // Если JSON - обрабатываем как JSON
		} else {
			return { message: await response.text() }; // Если текст - обрабатываем как текст
		}
	} catch (error) {
		console.error('Ошибка при отправке заказа:', error);
		throw error;
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
	getProducts,
	getProductById,
	getBrands,
	getProductsByBrand,
	getCategories,
	sendOrderToServer,
};

export default dataService;
