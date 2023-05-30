import { FC, useMemo } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import {
  setParamsPage,
  getResultsRepos,
  selectorSearchReposSlice
} from '../../../store/reducers/searchRestReposSlice';
import { getPaginationArray } from '../../../utils/helpers';
import { useSelector } from 'react-redux';
import { selectorUserAuth } from '../../../store/reducers/userAuthSlice';
import { selectorSearchValue } from '../../../store/reducers/searchValueSlice';

const PaginationRest: FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector(selectorUserAuth);
  const { search } = useSelector(selectorSearchValue);
  const {
    params,
    numberOfPages,
    isLoading: searchIsLoading
  } = useSelector(selectorSearchReposSlice);

  const handlePaginationClick = (page: number) => {
    if (searchIsLoading) return;
    dispatch(setParamsPage(page));
    dispatch(
      getResultsRepos({
        searchValue: search,
        oAuthToken: user?.oauthAccessToken,
        params: { page: page, per_page: params.per_page }
      })
    );
  };

  const numbersForPagination = useMemo(
    () => getPaginationArray(numberOfPages, params.page),
    [numberOfPages, params]
  );

  return (
    <div className="pagination-rest">
      <button
        className="navigation"
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
        className="navigation"
        onClick={() => handlePaginationClick(params.page + 1)}
        disabled={params.page === numberOfPages}>
        Next
      </button>
    </div>
  );
};

export default PaginationRest;
