import React, { FC, useEffect, useState } from 'react';
import MainContent from '../components/ui/MainContent';
import RepoItem from '../components/search/RepoItem';
import { useSelector } from 'react-redux';
import { selectorUserSlice } from '../store/reducers/userSlice';
import useDebounce from '../hooks/useDebounce';

const defaultValue = '';

interface MainPageProps {}

const MainPage: FC<MainPageProps> = () => {
  const { userRepos, isLoading, isError } = useSelector(selectorUserSlice);

  const [searchValue, setSearchValue] = useState<string>(defaultValue);
  const debouncedValue = useDebounce<string>(searchValue, 2000);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setSearchValue(search);
  };

  useEffect(() => {
    if (!searchValue) return;
    console.log(searchValue);
  }, [debouncedValue]);

  return (
    <MainContent>
      <form className="search">
        <label htmlFor="search">Search through all repositories on github:</label>
        <input
          value={searchValue}
          id="search"
          type="text"
          placeholder="Enter request.."
          onChange={handleInputValue}
        />
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
