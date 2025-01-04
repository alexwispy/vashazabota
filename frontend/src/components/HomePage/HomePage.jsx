import MainBanner from '../MainPage/MainBanner/MainBanner';
import Categories from '../MainPage/Categories/Categories';
import RecommendedProducts from '../MainPage/RecommendedProducts/RecommendedProducts';
import BrandSection from '../MainPage/BrandSection/BrandSection';
import SeasonalOffers from '../MainPage/SeasonalOffers/SeasonalOffers';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Главный баннер */}
      <MainBanner />

      {/* Популярные категории */}
      <Categories />

      {/* Рекомендуемые товары */}
      {/* <RecommendedProducts /> */}

      {/* О бренде "Ваша забота" */}
      {/* <BrandSection /> */}

      {/* Сезонные предложения */}
      {/* <SeasonalOffers /> */}
    </div>
  );
};

export default HomePage;
