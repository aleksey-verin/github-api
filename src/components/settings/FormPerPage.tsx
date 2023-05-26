import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../hooks/redux';
import {
  getResultsRepos,
  resetParamsPage,
  selectorSearchReposSlice,
  setParamsPerPage
} from '../../store/reducers/searchReposSlice';
import { selectorUserAuth } from '../../store/reducers/userAuthSlice';

interface FormPerPageProps {}

const FormPerPage: FC<FormPerPageProps> = () => {
  const dispatch = useAppDispatch();
  const {
    search,
    params: { per_page }
  } = useSelector(selectorSearchReposSlice);
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
    dispatch(setParamsPerPage(perPageInputValue));
    console.log(perPageInputValue);
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
    setPerPageInputDisabled(true);
  };

  useEffect(() => {
    if (!perPageInputDisabled && inputDebounce.current) {
      inputDebounce.current.focus();
    }
  }, [perPageInputDisabled]);

  return (
    <form onSubmit={handleSaveDebounce} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <label htmlFor="per_page">Number of items on the search page (pcs.)</label>
      <input
        id="per_page"
        style={{ width: 200 }}
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
        <button style={{ width: 100 }} type="button" onClick={handleEditDebounce}>
          Edit
        </button>
      ) : (
        <button style={{ width: 100 }} type="submit">
          Save
        </button>
      )}
    </form>
  );
};

export default FormPerPage;
