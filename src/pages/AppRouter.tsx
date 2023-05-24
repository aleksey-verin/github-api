import { FC } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainPage from './MainPage';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '../routes/routes';
import AboutPage from './AboutPage';
import SettingsPage from './SettingsPage';
import LoginPage from './LoginPage';

interface AppRouterProps {}

const AppRouter: FC<AppRouterProps> = () => {
  // const isAuth = true;

  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route element={<AboutPage />} path={ROUTES.publicRoutes.aboutPage} />
        <Route element={<MainPage />} path={ROUTES.publicRoutes.searchPage} />
        <Route element={<SettingsPage />} path={ROUTES.publicRoutes.settingsPage} />
        <Route element={<LoginPage />} path={ROUTES.publicRoutes.loginPage} />
        <Route path="*" element={<Navigate replace to={ROUTES.publicRoutes.searchPage} />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
};

export default AppRouter;
