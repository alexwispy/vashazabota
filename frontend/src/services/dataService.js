// src/services/dataService.js

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

const getProducts = async () => {
	return await fetchProductsFromServer(); // Получаем данные с сервера
};

const dataService = {
	getProducts,
};

export default dataService;
