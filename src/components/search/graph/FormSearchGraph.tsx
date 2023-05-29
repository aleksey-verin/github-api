import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import useDebounce from '../../../hooks/useDebounce';
import {
  resetParamsPage,
  getResultsRepos,
  selectorSearchReposSlice,
  clearSearchData
} from '../../../store/reducers/searchRestReposSlice';
import { selectorUserSettingsSlice } from '../../../store/reducers/userSettingsSlice';
import { selectorUserAuth } from '../../../store/reducers/userAuthSlice';
import {
  clearResultsGraphQl,
  resetRequestParamsGraphQl,
  searchGraphQlRepos,
  selectorSearchGraphQlReposSlice
} from '../../../store/reducers/searchGraphQlReposSlice';
import {
  clearSearchValue,
  selectorSearchValue,
  setSearchValue
} from '../../../store/reducers/searchValueSlice';
import { GraphQlRequestType, RequestTypes } from '../../../store/reducers/types/repoType';
import { PageInfo } from '../../../store/reducers/types/reposGraphQlTypes';

const defaultValue = '';

interface FormSearchProps {}

const FormSearch: FC<FormSearchProps> = () => {
  const dispatch = useAppDispatch();

  const { searchDebounce, requestType } = useSelector(selectorUserSettingsSlice);
  const { user } = useSelector(selectorUserAuth);
  const { search } = useSelector(selectorSearchValue);
  // for REST
  const { params } = useSelector(selectorSearchReposSlice);
  // for GraphQl
  const { paramsGraph, pageInfo } = useSelector(selectorSearchGraphQlReposSlice);

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

  const requestGraphQlApi = (
    value: string,
    token: string | undefined,
    per_request: number,
    type: GraphQlRequestType,
    pageInfo: PageInfo
  ) => {
    console.log('reset must be here');
    dispatch(resetRequestParamsGraphQl());
    if (token) {
      dispatch(
        searchGraphQlRepos({
          searchValue: value,
          oAuthToken: token,
          per_request: per_request,
          type,
          pageInfo
        })
      );
    } else {
      console.log('there is no auth token');
    }
    dispatch(setSearchValue(value));
  };

  useEffect(() => {
    if (!debouncedValue) return;
    if (searchInputValue === search) return;
    if (requestType === RequestTypes.REST) {
      requestRestApi(debouncedValue, user?.oauthAccessToken, params.per_page);
    } else {
      requestGraphQlApi(
        debouncedValue,
        user?.oauthAccessToken,
        paramsGraph.per_request,
        GraphQlRequestType.initial,
        pageInfo
      );
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
    if (requestType === RequestTypes.REST) {
      requestRestApi(searchInputValue, user?.oauthAccessToken, params.per_page);
    } else {
      requestGraphQlApi(
        searchInputValue,
        user?.oauthAccessToken,
        paramsGraph.per_request,
        GraphQlRequestType.initial,
        pageInfo
      );
    }
  };

  const handleReset = () => {
    setSearchInputValue(defaultValue);
    dispatch(clearSearchValue());
    if (requestType === RequestTypes.REST) {
      dispatch(clearSearchData());
    } else {
      dispatch(clearResultsGraphQl());
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
      <button>Send Request</button>
    </form>
  );
};

export default FormSearch;
