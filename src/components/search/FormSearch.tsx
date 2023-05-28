import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import useDebounce from '../../hooks/useDebounce';
import {
  resetParamsPage,
  getResultsRepos,
  selectorSearchReposSlice,
  clearSearchData
} from '../../store/reducers/searchRestReposSlice';
import { selectorUserSettingsSlice } from '../../store/reducers/userSettingsSlice';
import { selectorUserAuth } from '../../store/reducers/userAuthSlice';
import {
  searchGraphQlRepos,
  selectorSearchGraphQlReposSlice
} from '../../store/reducers/searchGraphQlReposSlice';
import {
  clearSearchValue,
  selectorSearchValue,
  setSearchValue
} from '../../store/reducers/searchValueSlice';
import { RequestTypes } from '../../store/reducers/types/repoType';

const defaultValue = '';

interface FormSearchProps {}

const FormSearch: FC<FormSearchProps> = () => {
  const dispatch = useAppDispatch();

  const { searchDebounce, requestType } = useSelector(selectorUserSettingsSlice);
  const { user } = useSelector(selectorUserAuth);
  const { params } = useSelector(selectorSearchReposSlice);
  const { search } = useSelector(selectorSearchValue);

  const [searchInputValue, setSearchInputValue] = useState<string>(search);
  const debouncedValue = useDebounce<string>(searchInputValue, searchDebounce);

  const requestRestApi = (value: string, token: string | undefined, per_page: number) => {
    dispatch(resetParamsPage());
    dispatch(
      getResultsRepos({
        searchValue: value,
        oAuthToken: token,
        params: { page: 1, per_page: per_page }
      })
    );
    dispatch(setSearchValue(value));
  };

  useEffect(() => {
    if (!debouncedValue) return;
    if (searchInputValue === search) return;
    if (requestType === RequestTypes.REST) {
      requestRestApi(debouncedValue, user?.oauthAccessToken, params.per_page);
    } else {
      console.log('graph');
    }
  }, [debouncedValue]);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userTypedValue = e.target.value;
    setSearchInputValue(userTypedValue);
    if (!userTypedValue) {
      dispatch(clearSearchValue());
      dispatch(clearSearchData());
    }
  };

  const handleSubmitSearch = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInputValue === search) return;
    requestRestApi(searchInputValue, user?.oauthAccessToken, params.per_page);
  };

  const handleReset = () => {
    setSearchInputValue(defaultValue);
    dispatch(clearSearchValue());
    dispatch(clearSearchData());
  };

  const { paramsGraph } = useSelector(selectorSearchGraphQlReposSlice);

  const requestData = () => {
    if (user?.oauthAccessToken) {
      dispatch(
        searchGraphQlRepos({
          searchValue: searchInputValue,
          oAuthToken: user?.oauthAccessToken,
          per_request: paramsGraph.per_request
        })
      );
    }
  };

  return (
    <form onSubmit={handleSubmitSearch} className="search">
      <label htmlFor="search">Search through all repositories on github:</label>
      <input
        value={searchInputValue}
        id="search"
        type="text"
        autoComplete="false"
        placeholder="Enter request.."
        onChange={handleInputValue}
      />
      <button onClick={handleReset} type="reset">
        Clear search
      </button>
      <button onClick={requestData}>Request</button>
    </form>
  );
};

export default FormSearch;
