import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../routes/routes';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectorUserAuth, userAuth, userSign } from '../store/reducers/userAuthSlice';
import { useAppDispatch } from '../hooks/redux';

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  const dispatch = useAppDispatch();
  const { isAuth, user } = useSelector(selectorUserAuth);
  // const isAuth = true;

  const handleLogOut = () => {
    dispatch(userAuth(userSign.out));
  };

  return (
    <header>
      <div className="header-logo">LOGO</div>
      <nav>
        <NavLink to={ROUTES.aboutPage}>About</NavLink>
        <NavLink to={ROUTES.searchPage}>Search</NavLink>
        <NavLink to={ROUTES.settingsPage}>Settings</NavLink>
      </nav>
      <div className="header-user">
        {isAuth ? (
          <>
            <div>{user?.displayName}</div>
            <button onClick={handleLogOut}>Log Out</button>
          </>
        ) : (
          <button>
            <Link to={ROUTES.loginPage}>Log In</Link>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
