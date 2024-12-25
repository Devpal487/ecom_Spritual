import React from 'react';
import { Route } from 'react-router-dom';
import ShopByCategories from './Components/section/ShopByCategories';
import FeaturedCategories from './Components/FeaturedCategories/FeaturedCategories';
import ProdSpec from './Prod_spec';
import EBookCart from './utils/EBookCart';
import Payment from './utils/Payment';
import HardCoverCarts from './utils/HardCoverCarts';
import Wishlist from './utils/Wishlist';
import LoginScreen from './user/LoginScreen';
import ForgotPasswordScreen from './user/ForgotPasswordScreen';
import ChangePasswordScreen from './user/ChangePasswordScreen';
import CaptchaVerification from './Components/CAPTCHA/CAPTCHAVerification';
import OrderConfirmation from './Components/OrderConfirmation/OrderConfirmation';
import UserRegistration from './user/UserRegistration';
import OrderHistory from './utils/OrderHistory/OrderHistory';
import Invoice from './utils/Invoice/Invoice';
import Filter from './utils/FilterBased';
import PageNotFound from './utils/PageNotFound';
import  YourAccount  from './Components/UserProfile/YourAccount';
import  YourProfile  from './Components/UserProfile/YourProfile';
import Donate from './utils/Donate';
import { Blog } from './utils/Blog';

export const routes = [
  <Route key="shop" path="/shop-by-categories" element={<ShopByCategories />} />,
  <Route key="featured" path="/:title" element={<FeaturedCategories />} />,
  <Route key="product" path="/:title/:uniqueId" element={<ProdSpec />} />,
  <Route key="cart" path="/cartDetails" element={<EBookCart />} />,
  <Route key="payment" path="/payment" element={<Payment />} />,
  <Route key="hardcover" path="/carts" element={<HardCoverCarts />} />,
  <Route key="wishlist" path="/wishlist" element={<Wishlist />} />,
  <Route key="login" path="/userlogin" element={<LoginScreen />} />,
  <Route key="forgot" path="/forgot-password" element={<ForgotPasswordScreen />} />,
  <Route key="change" path="/change-password" element={<ChangePasswordScreen />} />,
  <Route key="captcha" path="/:mode/captcha-verification" element={<CaptchaVerification />} />,
  <Route key="order" path="/order-confirmation" element={<OrderConfirmation />} />,
  <Route key="signup" path="/user/signup" element={<UserRegistration />} />,
  <Route key="history" path="/order_history" element={<OrderHistory />} />,
  <Route key="invoice" path="/Invoice" element={<Invoice />} />,
  <Route key="filter" path="/Filter" element={<Filter />} />,
  <Route key="sahayograshi" path="/sahayograshi" element={<Donate />} />,
  <Route key="blog" path="/blog" element={<Blog />} />,
  <Route  path="*" element={<PageNotFound />} />,
  // <Route key="account" path="/account" element={<YourAccount />} />,
  <Route key="profile" path="/profile" element={<YourProfile />} />,
];