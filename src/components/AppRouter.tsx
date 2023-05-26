import { FC } from 'react';
import Header from './Header';
import Footer from './Footer';
import MainPage from '../pages/MainPage';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '../routes/routes';
import AboutPage from '../pages/AboutPage';
import SettingsPage from '../pages/SettingsPage';
import LoginPage from '../pages/LoginPage';
import SingleRepoPage from '../pages/mainPage/SingleRepoPage';
import { useSelector } from 'react-redux';
import { selectorUserAuth } from '../store/reducers/userAuthSlice';

const AppRouter: FC = () => {
  const { isAuth } = useSelector(selectorUserAuth);

  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route element={<MainPage />} path={ROUTES.searchPage} />
        <Route element={<SingleRepoPage />} path={ROUTES.searchSinglePage} />
        <Route element={<AboutPage />} path={ROUTES.aboutPage} />
        <Route element={<SettingsPage />} path={ROUTES.settingsPage} />
        <Route path="*" element={<Navigate replace to={ROUTES.searchPage} />} />
        {!isAuth && <Route element={<LoginPage />} path={ROUTES.loginPage} />}
      </Routes>
      <Footer />
    </HashRouter>
  );
};

export default AppRouter;
