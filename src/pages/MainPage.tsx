import React, { FC, useEffect, useMemo, useState } from 'react';
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
  setParamsPage,
  setSearch
} from '../store/reducers/searchReposSlice';
import { selectorUserAuth } from '../store/reducers/userAuthSlice';
import { getPaginationArray } from '../utils/helpers';

const defaultValue = '';

interface MainPageProps {}

const MainPage: FC<MainPageProps> = () => {
  const dispatch = useAppDispatch();
  const { userRepos, isLoading, isError } = useSelector(selectorUserSlice);
  const { user } = useSelector(selectorUserAuth);
  const {
    search,
    resultsRepos,
    params,
    numberOfPages,
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
    dispatch(getResultsRepos({ searchValue, oAuthToken: user?.oauthAccessToken, params }));
    // console.log(searchValue);
    dispatch(setSearch(searchValue));
    // setSearchRequest(searchValue);
  };

  useEffect(() => {
    if (!debouncedValue) return;
    if (searchValue === search) return;
    dispatch(
      getResultsRepos({ searchValue: debouncedValue, oAuthToken: user?.oauthAccessToken, params })
    );
    // console.log(debouncedValue);
    dispatch(setSearch(debouncedValue));
    // setSearchRequest(debouncedValue);
  }, [debouncedValue]);

  const handleReset = () => {
    setSearchValue(defaultValue);
    dispatch(clearSearch());
    // setSearchRequest(defaultValue);
  };

  const handlePaginationClick = (page: number) => {
    dispatch(setParamsPage(page));
    dispatch(
      getResultsRepos({
        searchValue,
        oAuthToken: user?.oauthAccessToken,
        params: { page: page, per_page: params.per_page }
      })
    );
  };

  const numbersForPagination = useMemo(() => getPaginationArray(numberOfPages), [numberOfPages]);

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
            {user
              ? userRepos.map(
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
                )
              : 'Please log in to the app in order to see your own repositories'}
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
              <div>
                <button
                  disabled={params.page === 1}
                  onClick={() => handlePaginationClick(params.page - 1)}>
                  Back
                </button>
                {numbersForPagination.map((item) => (
                  <button
                    onClick={() => handlePaginationClick(item)}
                    style={item === params.page ? { backgroundColor: 'lightblue' } : {}}
                    disabled={item === params.page}
                    key={item}>
                    {item}
                  </button>
                ))}
                {numberOfPages > 10 ? <button>...</button> : null}
                <button
                  onClick={() => handlePaginationClick(params.page + 1)}
                  disabled={params.page === numberOfPages}>
                  Forward
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </MainContent>
  );
};

export default MainPage;
