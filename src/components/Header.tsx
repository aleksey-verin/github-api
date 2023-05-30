import { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../routes/routes';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectorUserAuth, userAuth, userSign } from '../store/reducers/userAuthSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import ImgBurger from './ui/image/ImgBurger';
import { clearLocalStorageData, storage } from '../utils/storage';

const Header: FC = () => {
  const dispatch = useAppDispatch();
  const { isAuth, user } = useSelector(selectorUserAuth);
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);

  const handleLogOut = async () => {
    await dispatch(userAuth(userSign.out));
    clearLocalStorageData(storage);
  };

  const closeMobileMenu = () => {
    setMobileMenuIsOpen(false);
  };

  return (
    <header>
      <button onClick={() => setMobileMenuIsOpen(!mobileMenuIsOpen)} className="header-burger">
        <ImgBurger />
      </button>
      <div className="header-logo">LOGO</div>
      <nav className="header-nav__desktop">
        <NavLink to={ROUTES.searchPage}>Search</NavLink>
        <NavLink to={ROUTES.aboutPage}>About</NavLink>
        <NavLink to={ROUTES.settingsPage}>Settings</NavLink>
      </nav>
      <div className="header-user">
        {isAuth ? (
          <>
            <div>{user?.displayName}</div>
            <button onClick={handleLogOut}>Log Out</button>
          </>
        ) : (
          <Link to={ROUTES.loginPage}>
            <button>Log In</button>
          </Link>
        )}
      </div>
      {mobileMenuIsOpen && (
        <nav className="header-nav__mobile">
          <NavLink onClick={closeMobileMenu} to={ROUTES.searchPage}>
            Search
          </NavLink>
          <NavLink onClick={closeMobileMenu} to={ROUTES.aboutPage}>
            About
          </NavLink>
          <NavLink onClick={closeMobileMenu} to={ROUTES.settingsPage}>
            Settings
          </NavLink>
        </nav>
      )}
    </header>
  );
};

export default Header;
