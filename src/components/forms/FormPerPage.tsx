import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import {
  getResultsRepos,
  resetParamsPage,
  selectorSearchReposSlice,
  setParamsPerPage
} from '../../store/reducers/searchRestReposSlice';
import { selectorUserAuth } from '../../store/reducers/userAuthSlice';
import { selectorSearchValue } from '../../store/reducers/searchValueSlice';
import {
  clearResultsGraphQl,
  resetRequestParamsGraphQl,
  searchGraphQlRepos,
  selectorSearchGraphQlReposSlice,
  setParamsPerPageGraphQl
} from '../../store/reducers/searchGraphQlReposSlice';
import { selectorUserSettingsSlice } from '../../store/reducers/userSettingsSlice';
import { GraphQlRequestType, RequestTypes } from '../../store/types/repoType';
import { showNoteSaveParams } from '../../utils/notifications';

const FormPerPage: FC = () => {
  const dispatch = useAppDispatch();
  const {
    params: { per_page }
  } = useSelector(selectorSearchReposSlice);
  const {
    pagination: { per_page: perPageGraph, max_pagination_items },
    pageInfo
  } = useSelector(selectorSearchGraphQlReposSlice);
  const { search } = useSelector(selectorSearchValue);
  const { user } = useSelector(selectorUserAuth);
  const { requestType } = useSelector(selectorUserSettingsSlice);

  const [perPageInputDisabled, setPerPageInputDisabled] = useState(true);

  const [perPageInputValue, setPerPageInputValue] = useState(0);
  const inputDebounce = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (requestType === RequestTypes.REST) {
      setPerPageInputValue(per_page);
    }
    if (requestType === RequestTypes.GraphQl) {
      setPerPageInputValue(perPageGraph);
    }
  }, [requestType, per_page, perPageGraph]);

  const handleEditDebounce = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPerPageInputDisabled(false);
  };

  const handleSavePerPage = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPerPageInputDisabled(true);

    if (requestType === RequestTypes.REST) {
      if (perPageInputValue === per_page) return;
      dispatch(setParamsPerPage(perPageInputValue));
      if (search) {
        dispatch(resetParamsPage());
        dispatch(
          getResultsRepos({
            searchValue: search,
            oAuthToken: user?.oauthAccessToken,
            params: { page: 1, per_page: perPageInputValue }
          })
        );
      }
    }
    if (requestType === RequestTypes.GraphQl) {
      if (perPageInputValue === perPageGraph) return;
      dispatch(setParamsPerPageGraphQl(perPageInputValue));
      if (user) {
        dispatch(resetRequestParamsGraphQl());
        dispatch(clearResultsGraphQl());
        const newRequest = dispatch(
          searchGraphQlRepos({
            searchValue: search,
            oAuthToken: user?.oauthAccessToken,
            per_request: perPageInputValue * max_pagination_items,
            type: GraphQlRequestType.initial,
            pageInfo
          })
        );
        showNoteSaveParams(newRequest);
      }
    }
  };

  useEffect(() => {
    if (!perPageInputDisabled && inputDebounce.current) {
      inputDebounce.current.focus();
    }
  }, [perPageInputDisabled]);

  return (
    <form onSubmit={handleSavePerPage}>
      <label htmlFor="per_page">Number of items on the search page (pcs.)</label>
      <div>
        <input
          id="per_page"
          ref={inputDebounce}
          disabled={perPageInputDisabled}
          type="number"
          placeholder="value for per page parameter"
          step={4}
          min={4}
          max={requestType === RequestTypes.REST ? 28 : 20}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPerPageInputValue(Number(e.target.value))
          }
          value={perPageInputValue}
        />
        {perPageInputDisabled ? (
          <button type="button" onClick={handleEditDebounce}>
            Edit
          </button>
        ) : (
          <button type="submit">Save</button>
        )}
      </div>
    </form>
  );
};

export default FormPerPage;
