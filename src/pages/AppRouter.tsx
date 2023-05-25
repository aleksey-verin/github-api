import { FC } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainPage from './MainPage';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '../routes/routes';
import AboutPage from './AboutPage';
import SettingsPage from './SettingsPage';
import LoginPage from './LoginPage';
import SingleRepoPage from './SingleRepoPage';
import { useSelector } from 'react-redux';
import { selectorUserAuth } from '../store/reducers/userAuthSlice';

interface AppRouterProps {}

const AppRouter: FC<AppRouterProps> = () => {
  const { isAuth } = useSelector(selectorUserAuth);
  // const isAuth = true;

  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route element={<AboutPage />} path={ROUTES.aboutPage} />
        <Route element={<MainPage />} path={ROUTES.searchPage} />
        <Route element={<SingleRepoPage />} path={ROUTES.searchSinglePage} />
        <Route element={<SettingsPage />} path={ROUTES.settingsPage} />
        <Route path="*" element={<Navigate replace to={ROUTES.searchPage} />} />
        {!isAuth && <Route element={<LoginPage />} path={ROUTES.loginPage} />}
      </Routes>
      <Footer />
    </HashRouter>
  );
};

export default AppRouter;
