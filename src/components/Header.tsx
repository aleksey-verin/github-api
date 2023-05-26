import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../routes/routes';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectorUserAuth, userAuth, userSign } from '../store/reducers/userAuthSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';

const Header: FC = () => {
  const dispatch = useAppDispatch();
  const { isAuth, user } = useSelector(selectorUserAuth);

  const handleLogOut = () => {
    dispatch(userAuth(userSign.out));
  };

  return (
    <header>
      <div className="header-logo">LOGO</div>
      <nav>
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
    </header>
  );
};

export default Header;
