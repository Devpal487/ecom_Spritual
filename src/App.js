import React, { useEffect, useReducer, useState } from "react";
import { LanguageProvider } from "./utils/LanguageContext";
import { AuthProvider } from "./utils/Provider/AuthContext";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import NavBar from "./Components/Navbar";
import ImageSlider from "./Components/Image_slider";
import AdsBanner from "./Components/Banner";
import ShopByCategories from "./Components/section/ShopByCategories";
import { store } from "./store/store";
import { ThemeProvider } from "./utils/Provider/ThemeContext";
import { useTheme } from "./utils/Provider/ThemeContext";
import WelcomeMessage from "./utils/Message/WelcomeMessage";
import Footer from "./Components/Footer/Footer";
import { GetSettingMaster, onLoadData } from "./utils/APIURL";
import CartProvider from "./utils/Provider/CartContext";
import Chatbot from "./Components/ChatBot/Chatbot";
import { routes } from "./routes";
import { ProfileThemeProvider, useProfileTheme } from "./utils/Provider/ProfileProvider";


const initialState = {
  isActiveSlider: false,
  isActiveCategory: false,
  noOfCard: 4,
  noOfRow: 0,
  websettingLogo: "",
  names: "",
  webSetting: "",
  addBanner: false,
  addSection: false,
};

function webSettingReducer(state, action) {
  switch (action.type) {
    case "SET_WEB_SETTING":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function AppContent() {
  const location = useLocation();
  const themeMaster = useTheme();
  const {profile} = useProfileTheme();
  const [state, dispatch] = useReducer(webSettingReducer, initialState);
  const [memImg, setMemImg] = useState("");
  const [memName, setMemName] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (profile?.userData?.memberPic) {
      setMemImg(profile?.memberPic); 
      setMemName(profile?.membName); 
    }
  }, [profile]);

  useEffect(() => {
    fetchWebSettingData();
    fetchApiOnly();
  }, []);

  const fetchApiOnly =async()=>{
    let check = await onLoadData();
    // console.log(check?.greeting);
    if(check.greeting){
      setGreeting(check?.greeting);
    }else{
      setGreeting("");
    }
  }

  const fetchWebSettingData = async () => {
    try {
      const result = await GetSettingMaster();
      if (result?.data?.length > 0) {
        dispatch({
          type: "SET_WEB_SETTING",
          payload: {
            webSetting: result.data,
            isActiveSlider: result.data[0].slider,
            isActiveCategory: result.data[0].headerCategoryActive,
            noOfCard: result.data[0].noOfCard,
            noOfRow: result.data[0].noOfRow,
            websettingLogo: result.data[0].websideLogo,
            names: result.data[0].name,
            addBanner: result.data[0].addBanner,
            addSection: result.data[0].addSection,
          },
        });
      }
    } catch (error) {
      // console.error('Error fetching web settings:', error);
    }
  };

  const theme = themeMaster?.theme;
  const hasBackgroundImage = Boolean(theme.backgroundImage);
  const backgroundImageUrl = hasBackgroundImage
    ? `${theme.backgroundImage}`
    : "none";
  const isLoginPage = [
    "/userlogin",
    "/forgot-password",
    "/change-password",
    "/user/signup"
  ].includes(location.pathname);

  return (
    <div
      className={`app-container ${theme.backgroundColor} ${theme.textColor} ${theme.fontSize} ${theme.fontFamily}`}
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        backgroundColor: hasBackgroundImage
          ? "transparent"
          : theme.backgroundColor,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="content-wrapper" style={{ flex: "1 0 auto" }}>
        <WelcomeMessage />
        {!isLoginPage && (
          <NavBar websettingLogo={state.websettingLogo} memImg={memImg} membName={memName} />
        )}
        <Chatbot greets={greeting} />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isActiveSlider={state.isActiveSlider}
                isActiveCategory={state.isActiveCategory}
                noOfCard={state.noOfCard}
                noOfRow={state.noOfRow}
                names={state.names}
                isBanner={state.addBanner}
                isaddSection={state.addSection}
              />
            }
          />
          {/* {routes} */}
          {routes.map((route, index) => (
            
    <Route
    key={route.key || index} 
    path={route.props.path}
    element={route.props.element}
    />
  ))}
        </Routes>
      </div>
      {!isLoginPage && (
        <footer style={{ flexShrink: 0 }}>
          <Footer webSettingName={state.names} />
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
                <ProfileThemeProvider>
    <LanguageProvider>
      <CartProvider>
        <Provider store={store}>
          <AuthProvider>
            <ThemeProvider>
              <Router>
                  <AppContent />
              </Router>
            </ThemeProvider>
          </AuthProvider>
        </Provider>
      </CartProvider>
    </LanguageProvider>
                </ProfileThemeProvider>
  );
}

function Home({
  isActiveSlider,
  isActiveCategory,
  noOfCard,
  noOfRow,
  isBanner,
  isaddSection,
}) {
  return (
    <>
      {/* <IndexHeader isActiveCategory={isActiveCategory} /> */}
      <ImageSlider isActiveSlider={isActiveSlider} />
      <AdsBanner isaddSection={isaddSection} />
      <ShopByCategories
        noOfCard={noOfCard}
        noOfRow={noOfRow}
        isBanner={isBanner}
      />
    </>
  );
}
