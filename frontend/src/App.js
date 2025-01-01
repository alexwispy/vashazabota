// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Импортируем маршруты
import './index.css';	// Подключаем обнуление стилей
import Header from './components/Header/Header'; // Импортируем компонент шапки
import Footer from './components/Footer/Footer'; // Импортируем компонент футера
import ProductList from './components/ProductList/ProductList'; // Импортируем компонент с продуктами
import Contact from './components/Contact/Contact';
import BrandList from './components/BrandList/BrandList'; // Импортируем компонент с брендами
import HomePage from './components/HomePage/HomePage'; // Импортируем компонент главной страницы
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';	// Импортируем компонент с политикой конфиденциальности
import PaymentRules from './components/PaymentRules/PaymentRules'; // Импортируем компонент с правилами оплаты
import ReturnAndExchange from './components/ReturnAndExchange/ReturnAndExchange'; // Импортируем компонент с условиями возврата
import Cart from './components/Cart/Cart'; // Импортируем компонент корзины
import ProductDetail from './components/ProductDetails/ProductDetail'; // Импортируем компонент с деталями продукта


function App() {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/products" element={<ProductList />} />
				<Route path="/brands" element={<BrandList />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/privacy-policy" element={<PrivacyPolicy />} />
				<Route path="/payment-rules" element={<PaymentRules />} />
				<Route path="/return-and-exchange" element={<ReturnAndExchange />} />
				<Route path="/cart" element={<Cart />} />
				<Route path="/products/:id" element={<ProductDetail />} />
			</Routes>
			<Footer />
		</Router>
	);
}

export default App;
