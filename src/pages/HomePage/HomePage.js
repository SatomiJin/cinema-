import HomePageMobile from "../../components/HomePageComponent/Mobile/HomePageMobile";
import HomePagePCTablet from "../../components/HomePageComponent/PCTablet/HomePagePCTablet";
import { FilmProvider } from "../../context/filmContext";
import "./HomePage.scss";
function HomePage() {
  return (
    <div className="home-page-container">
      <FilmProvider>
        <div className="pc-tablet-home">
          <HomePagePCTablet />
        </div>
        <div className="mobile-home">
          <HomePageMobile />
        </div>
      </FilmProvider>
    </div>
  );
}

export default HomePage;
