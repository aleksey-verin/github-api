import React, { FC, useEffect, useState } from 'react';
import MainContent from '../components/ui/MainContent';
import RepoItem from '../components/search/RepoItem';
import { useSelector } from 'react-redux';
import { selectorUserSlice } from '../store/reducers/userSlice';
import useDebounce from '../hooks/useDebounce';
import { useAppDispatch } from '../hooks/redux';
import {
  clearSearch,
  getResultsRepos,
  selectorSearchReposSlice,
  setSearch
} from '../store/reducers/searchReposSlice';

const defaultValue = '';

interface MainPageProps {}

const MainPage: FC<MainPageProps> = () => {
  const dispatch = useAppDispatch();
  const { userRepos, isLoading, isError } = useSelector(selectorUserSlice);
  const {
    search,
    resultsRepos,
    isLoading: searchIsLoading,
    isSuccess: searchIsSuccess,
    isError: searchIsError
  } = useSelector(selectorSearchReposSlice);

  const [searchValue, setSearchValue] = useState<string>(search);
  const debouncedValue = useDebounce<string>(searchValue, 2000);
  // const [searchRequest, setSearchRequest] = useState<string>(defaultValue); // заменить на стор

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchValue(inputValue);
    if (!inputValue) {
      dispatch(clearSearch());
    }
  };

  const handleSubmitSearch = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue === search) return;
    dispatch(getResultsRepos(searchValue));
    // console.log(searchValue);
    dispatch(setSearch(searchValue));
    // setSearchRequest(searchValue);
  };

  useEffect(() => {
    if (!debouncedValue) return;
    if (searchValue === search) return;
    dispatch(getResultsRepos(debouncedValue));
    // console.log(debouncedValue);
    dispatch(setSearch(debouncedValue));
    // setSearchRequest(debouncedValue);
  }, [debouncedValue]);

  const handleReset = () => {
    setSearchValue(defaultValue);
    dispatch(clearSearch());
    // setSearchRequest(defaultValue);
  };

  return (
    <MainContent>
      <form onSubmit={handleSubmitSearch} className="search">
        <label htmlFor="search">Search through all repositories on github:</label>
        <input
          value={searchValue}
          id="search"
          type="text"
          placeholder="Enter request.."
          onChange={handleInputValue}
        />
        <button onClick={handleReset} type="reset">
          Clear search
        </button>
      </form>
      {!search ? (
        <section className="user-repositories">
          <div className="user-repositories__title">List of your repositories:</div>
          {isLoading && <div>Loading..</div>}
          {isError && <div>Sorry, error..</div>}
          <div className="user-repositories__list">
            {userRepos.map(
              ({ id, name, owner: { login }, stargazers_count, language, pushed_at }) => (
                <RepoItem
                  key={id}
                  path={id}
                  repo={name}
                  author={login}
                  score={stargazers_count}
                  language={language}
                  pushed_at={pushed_at}
                />
              )
            )}
          </div>
        </section>
      ) : (
        <section className="user-repositories">
          {searchIsLoading && <div>Loading..</div>}
          {searchIsError && <div>Sorry, error..</div>}
          {searchIsSuccess && (
            <>
              <div className="user-repositories__title">
                {`As a result of the search, ${resultsRepos?.total_count} repositories were found:`}
              </div>

              <div className="user-repositories__list">
                {resultsRepos?.items.map(
                  ({ id, name, owner: { login }, stargazers_count, language, pushed_at }) => (
                    <RepoItem
                      key={id}
                      path={id}
                      repo={name}
                      author={login}
                      score={stargazers_count}
                      language={language}
                      pushed_at={pushed_at}
                    />
                  )
                )}
              </div>
            </>
          )}
        </section>
      )}
    </MainContent>
  );
};

export default MainPage;
