import React, { FC, useEffect, useMemo, useState } from 'react';
import MainContent from '../components/ui/MainContent';
import RepoItem from '../components/search/RepoItem';
import { useSelector } from 'react-redux';
import { selectorUserSlice } from '../store/reducers/userReposSlice';
import useDebounce from '../hooks/useDebounce';
import { useAppDispatch } from '../hooks/useAppDispatch';
import {
  clearSearch,
  getResultsRepos,
  resetParamsPage,
  selectorSearchReposSlice,
  setParamsPage,
  setSearch
} from '../store/reducers/searchReposSlice';
import { selectorUserAuth } from '../store/reducers/userAuthSlice';
import { getPaginationArray } from '../utils/helpers';
import { selectorUserSettingsSlice } from '../store/reducers/userSettingsSlice';

const defaultValue = '';

const MainPage: FC = () => {
  const dispatch = useAppDispatch();
  const { userRepos, isLoading, isError } = useSelector(selectorUserSlice);
  const { user } = useSelector(selectorUserAuth);
  const {
    search,
    resultsRepos,
    params,
    numberOfPages,
    isLoading: searchIsLoading,
    isError: searchIsError
  } = useSelector(selectorSearchReposSlice);
  const { searchDebounce } = useSelector(selectorUserSettingsSlice);

  const [searchValue, setSearchValue] = useState<string>(search);
  const debouncedValue = useDebounce<string>(searchValue, searchDebounce);

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
    dispatch(resetParamsPage());
    dispatch(
      getResultsRepos({
        searchValue,
        oAuthToken: user?.oauthAccessToken,
        params: { page: 1, per_page: params.per_page }
      })
    );
    dispatch(setSearch(searchValue));
  };

  useEffect(() => {
    if (!debouncedValue) return;
    if (searchValue === search) return;
    dispatch(resetParamsPage());
    dispatch(
      getResultsRepos({
        searchValue: debouncedValue,
        oAuthToken: user?.oauthAccessToken,
        params: { page: 1, per_page: params.per_page }
      })
    );
    dispatch(setSearch(debouncedValue));
  }, [debouncedValue]);

  const handleReset = () => {
    setSearchValue(defaultValue);
    dispatch(clearSearch());
  };

  const handlePaginationClick = (page: number) => {
    if (searchIsLoading) return;
    dispatch(setParamsPage(page));
    dispatch(
      getResultsRepos({
        searchValue,
        oAuthToken: user?.oauthAccessToken,
        params: { page: page, per_page: params.per_page }
      })
    );
  };

  const numbersForPagination = useMemo(
    () => getPaginationArray(numberOfPages, params.page),
    [numberOfPages, params]
  );

  console.log(`MainPage param.pre_page ${params.per_page}`);

  return (
    <MainContent>
      <form onSubmit={handleSubmitSearch} className="search">
        <label htmlFor="search">Search through all repositories on github:</label>
        <input
          value={searchValue}
          id="search"
          type="text"
          autoComplete="false"
          placeholder="Enter request.."
          onChange={handleInputValue}
        />
        <button onClick={handleReset} type="reset">
          Clear search
        </button>
      </form>
      {!search ? (
        <section className="user-repositories">
          <div className="user-repositories__title">
            {user
              ? 'List of your repositories:'
              : 'Please log in to the app in order to see your own repositories'}
          </div>
          {isLoading && <div>Loading..</div>}
          {isError && <div>Sorry, error..</div>}
          <div className="user-repositories__list">
            {user &&
              userRepos.map(
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
          {searchIsError && <div>Sorry, error..</div>}
          <>
            <div className="user-repositories__title">
              <span>{resultsRepos?.total_count}</span> repositories were found for the query{' '}
              <span>{search}</span>:
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

            <div className="pagination">
              <button
                disabled={params.page === 1}
                onClick={() => handlePaginationClick(params.page - 1)}>
                Back
              </button>
              {numbersForPagination.map((item) => (
                <button
                  onClick={() => handlePaginationClick(item)}
                  className={item === params.page ? 'active' : ''}
                  disabled={item === params.page}
                  key={item}>
                  {item}
                </button>
              ))}
              <button
                onClick={() => handlePaginationClick(params.page + 1)}
                disabled={params.page === numberOfPages}>
                Next
              </button>
            </div>
          </>
        </section>
      )}
    </MainContent>
  );
};

export default MainPage;
