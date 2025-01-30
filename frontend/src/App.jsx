import './index.css';	// Подключаем обнуление стилей
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Импортируем маршруты
import { YMInitializer } from 'react-yandex-metrika';
import Header from './components/Header/Header'; // Импортируем компонент шапки
import Footer from './components/Footer/Footer'; // Импортируем компонент футера
import HomePage from './components/HomePage/HomePage'; // Импортируем компонент домашней страницы
import ProductList from './components/Catalog/Catalog'; // Импортируем компонент с продуктами
import Contact from './components/Contact/Contact';
import BrandList from './components/BrandList/BrandList'; // Импортируем каталог с брендами
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';	// Импортируем компонент с политикой конфиденциальности
import PaymentRules from './components/PaymentRules/PaymentRules'; // Импортируем компонент с правилами оплаты
import ReturnAndExchange from './components/ReturnAndExchange/ReturnAndExchange'; // Импортируем компонент с условиями возврата
import Cart from './components/Cart/Cart'; // Импортируем компонент корзины
import ProductDetail from './components/ProductDetails/ProductDetail'; // Импортируем компонент с деталями продукта
import CheckoutPage from './components/CheckoutPage/CheckoutPage'; // Импортируем компонент страницы оформления заказа

function App() {
	return (
		<Router>
			<Header />
			<YMInitializer accounts={[99714324]} options={{ webvisor: true, clickmap: true }} />
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
				<Route path="/checkout" element={<CheckoutPage />} />
			</Routes>
			<Footer />
		</Router>
	);
}

export default App;
