import { FC } from 'react';
import MainContent from '../components/ui/MainContent';
import RepoItem from '../components/search/RepoItem';
import { useSelector } from 'react-redux';
import { selectorUserSlice } from '../store/reducers/userSlice';

interface MainPageProps {}

const MainPage: FC<MainPageProps> = () => {
  const { userRepos, isLoading, isError } = useSelector(selectorUserSlice);

  return (
    <MainContent>
      <form className="search">
        <label htmlFor="search">Search through all repositories on github:</label>
        <input id="search" type="text" placeholder="Enter request.." />
      </form>
      <section className="user-repositories">
        <div className="user-repositories__title">List of your repositories:</div>
        {isLoading && <div>Loading..</div>}
        {isError && <div>Sorry, error..</div>}
        <div className="user-repositories__list">
          {userRepos.map(({ name, owner: { login }, stargazers_count, language, pushed_at }) => (
            <RepoItem
              key={name}
              repo={name}
              author={login}
              score={stargazers_count}
              language={language}
              pushed_at={pushed_at}
            />
          ))}
        </div>
      </section>
    </MainContent>
  );
};

export default MainPage;
