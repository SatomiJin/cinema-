import HomePageMobile from "../../components/HomePageComponent/Mobile/HomePageMobile";
import HomePagePCTablet from "../../components/HomePageComponent/PCTablet/HomePagePCTablet";
import "./HomePage.scss";
function HomePage() {
  return (
    <div className="home-page-container">
      <div className="pc-tablet-home">
        <HomePagePCTablet />
      </div>
      <div className="mobile-home">
        <HomePageMobile />
      </div>
    </div>
  );
}

export default HomePage;
