import './index.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Импортируем маршруты
import { YMInitializer } from 'react-yandex-metrika';
import { useEffect, useState } from 'react'; // useState для управления сайдбаром
import { CartProvider } from './components/CartContext/CartContext'; // Оставляем только CartProvider
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
	// Состояние сайдбара
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Функция переключения состояния сайдбара
	const toggleSidebar = () => {
		setSidebarOpen((prev) => !prev);
	};

	// Интеграция с Telegram Web Apps API
	useEffect(() => {
		if (window.Telegram?.WebApp) {
			const tg = window.Telegram.WebApp;
			tg.expand(); // Разворачивает мини-приложение на весь экран
			document.body.classList.add("telegram-app"); // Добавляем класс для скрытия футера
		} else {
			document.body.classList.remove("telegram-app");
		}
	}, []);

	return (
		<CartProvider>
			<div className="app"> {/* Добавляем класс app */}
				<Router>
					<Header />
					<MobileHeader onCatalogClick={toggleSidebar} />
					<YMInitializer accounts={[99714324]} options={{ webvisor: true, clickmap: true }} />
					<main className="content"> {/* Основной контент */}
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
					</main>
					{!window.Telegram?.WebApp && <Footer />} {/* Футер не рендерится в мини-приложении */}
				</Router>
			</div>
		</CartProvider>
	);
}

export default App;
