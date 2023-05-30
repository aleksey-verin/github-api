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

const FormPerPage: FC = () => {
  const dispatch = useAppDispatch();
  const {
    params: { per_page }
  } = useSelector(selectorSearchReposSlice);
  const { search } = useSelector(selectorSearchValue);
  const { user } = useSelector(selectorUserAuth);

  const [perPageInputDisabled, setPerPageInputDisabled] = useState(true);
  const [perPageInputValue, setPerPageInputValue] = useState(per_page);
  const inputDebounce = useRef<HTMLInputElement>(null);

  const handleEditDebounce = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPerPageInputDisabled(false);
  };

  const handleSaveDebounce = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPerPageInputDisabled(true);
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
  };

  useEffect(() => {
    if (!perPageInputDisabled && inputDebounce.current) {
      inputDebounce.current.focus();
    }
  }, [perPageInputDisabled]);

  return (
    <form onSubmit={handleSaveDebounce}>
      <label htmlFor="per_page">Number of items on the search page (only with REST) (pcs.)</label>
      <div>
        <input
          id="per_page"
          ref={inputDebounce}
          disabled={perPageInputDisabled}
          type="number"
          placeholder="value for per page parameter"
          step={3}
          min={3}
          max={33}
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
