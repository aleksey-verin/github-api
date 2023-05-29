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
  clearResultsGraphQl,
  resetRequestParamsGraphQl,
  searchGraphQlRepos,
  selectorSearchGraphQlReposSlice
} from '../../store/reducers/searchGraphQlReposSlice';
import {
  clearSearchValue,
  selectorSearchValue,
  setSearchValue
} from '../../store/reducers/searchValueSlice';
import { GraphQlRequestType, RequestTypes } from '../../store/reducers/types/repoType';
import { PageInfo } from '../../store/reducers/types/reposGraphQlTypes';
import ImgLoader from '../ui/image/ImgLoader';

const defaultValue = '';

const FormSearch: FC = () => {
  const dispatch = useAppDispatch();

  const { searchDebounce, requestType } = useSelector(selectorUserSettingsSlice);
  const { user, isAuth } = useSelector(selectorUserAuth);
  const { search } = useSelector(selectorSearchValue);
  const { params } = useSelector(selectorSearchReposSlice);
  const { paramsGraph, pageInfo } = useSelector(selectorSearchGraphQlReposSlice);

  const [searchInputValue, setSearchInputValue] = useState<string>(search);
  const debouncedValue = useDebounce<string>(searchInputValue, searchDebounce);

  const [loaderRequestButton, setLoaderRequestButton] = useState(false);

  const requestRestApi = async (value: string, token: string | undefined, per_page: number) => {
    setLoaderRequestButton(true);
    dispatch(resetParamsPage());
    dispatch(
      getResultsRepos({
        searchValue: value,
        oAuthToken: token,
        params: { page: 1, per_page: per_page }
      })
    );
    dispatch(setSearchValue(value));
    setLoaderRequestButton(false);
  };

  const requestGraphQlApi = async (
    value: string,
    token: string | undefined,
    per_request: number,
    type: GraphQlRequestType,
    pageInfo: PageInfo
  ) => {
    setLoaderRequestButton(true);
    dispatch(resetRequestParamsGraphQl());
    if (token) {
      await dispatch(
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
    setLoaderRequestButton(false);
  };

  useEffect(() => {
    if (!debouncedValue) return;
    if (searchInputValue === search) return;
    if (requestType === RequestTypes.REST) {
      requestRestApi(debouncedValue, user?.oauthAccessToken, params.per_page);
    } else {
      if (isAuth) {
        requestGraphQlApi(
          debouncedValue,
          user?.oauthAccessToken,
          paramsGraph.per_request,
          GraphQlRequestType.initial,
          pageInfo
        );
      } else {
        console.log('no auth for graphql request');
      }
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
      if (isAuth) {
        requestGraphQlApi(
          searchInputValue,
          user?.oauthAccessToken,
          paramsGraph.per_request,
          GraphQlRequestType.initial,
          pageInfo
        );
      } else {
        console.log('no auth for graphql request');
      }
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
      <button className="search-button-send">
        <div>Send Request</div>
        <div>{loaderRequestButton && <ImgLoader />}</div>
      </button>
      <button onClick={handleReset} type="reset">
        Clear search
      </button>
    </form>
  );
};

export default FormSearch;
