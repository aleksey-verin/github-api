import { FC } from 'react';
import MainContent from '../components/ui/MainContent';

interface MainPageProps {}

const MainPage: FC<MainPageProps> = () => {
  return (
    <MainContent>
      <form className="search">
        <label htmlFor="search">Поиск по репозиториям</label>
        <input id="search" type="text" placeholder="Enter request.." />
      </form>
    </MainContent>
  );
};

export default MainPage;
