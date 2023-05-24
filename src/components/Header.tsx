import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../routes/routes';
import { Link } from 'react-router-dom';

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  const isAuth = false;

  return (
    <header>
      <div className="logo">LOGO</div>
      <nav>
        <NavLink to={ROUTES.publicRoutes.aboutPage}>About</NavLink>
        <NavLink to={ROUTES.publicRoutes.searchPage}>Search</NavLink>
        <NavLink to={ROUTES.publicRoutes.settingsPage}>Settings</NavLink>
      </nav>
      <div className="user">
        {isAuth ? <div>USER</div> : <Link to={ROUTES.publicRoutes.loginPage}>Log In</Link>}
      </div>
    </header>
  );
};

export default Header;
