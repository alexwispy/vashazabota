import './index.css'; // Подключаем обнуление стилей
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Импортируем маршруты
import { YMInitializer } from 'react-yandex-metrika';
import { useState } from 'react'; // Добавлен useState для управления сайдбаром
import Header from './components/Header/Header';
import MobileHeader from './components/MobileHeader/MobileHeader';
import Footer from './components/Footer/Footer';
import HomePage from './components/HomePage/HomePage';
import Contact from './components/Contact/Contact';
import Catalog from './components/Catalog/Catalog';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';
import PaymentRules from './components/PaymentRules/PaymentRules';
import ReturnAndExchange from './components/ReturnAndExchange/ReturnAndExchange';
import Cart from './components/Cart/Cart';
import ProductDetail from './components/ProductDetails/ProductDetail';
import CheckoutPage from './components/CheckoutPage/CheckoutPage';

function App() {
	const [sidebarOpen, setSidebarOpen] = useState(false); // Сайдбар изначально закрыт

	// Функция переключения состояния сайдбара
	const toggleSidebar = () => {
		setSidebarOpen((prev) => !prev);
	};

	return (
		<Router>
			<Header />
			<MobileHeader onCatalogClick={toggleSidebar} /> {/* Переключение сайдбара при клике на "Каталог" */}
			<YMInitializer accounts={[99714324]} options={{ webvisor: true, clickmap: true }} />
			<Routes>
				<Route
					path="/products"
					element={<Catalog sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
				/>
				<Route path="/" element={<HomePage />} />
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
