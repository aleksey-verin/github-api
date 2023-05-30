import { FC, useMemo, useState } from 'react';
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
import ImgLoader from '../../ui/image/ImgLoader';

const PaginationRest: FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector(selectorUserAuth);
  const { search } = useSelector(selectorSearchValue);
  const {
    totalCountRepos,
    params,
    numberOfPages,
    isLoading: searchIsLoading,
    isError
  } = useSelector(selectorSearchReposSlice);
  const [loaderNextButton, setLoaderNextButton] = useState(false);
  const [loaderBackButton, setLoaderBackButton] = useState(false);

  const loadAnotherPage = async (page: number) => {
    if (searchIsLoading) return;
    await dispatch(
      getResultsRepos({
        searchValue: search,
        oAuthToken: user?.oauthAccessToken,
        params: { page: page, per_page: params.per_page }
      })
    );
    if (!isError) {
      dispatch(setParamsPage(page));
    }
  };

  const handleNavigationNext = async (page: number) => {
    setLoaderNextButton(true);
    await loadAnotherPage(page);
    setLoaderNextButton(false);
  };
  const handleNavigationBack = async (page: number) => {
    setLoaderBackButton(true);
    await loadAnotherPage(page);
    setLoaderBackButton(false);
  };

  const numbersForPagination = useMemo(
    () => getPaginationArray(numberOfPages, params.page),
    [numberOfPages, params]
  );

  if (!totalCountRepos) return null;

  return (
    <div className="pagination-rest">
      <button
        className="navigation"
        disabled={params.page === 1}
        onClick={() => handleNavigationBack(params.page - 1)}>
        <div>{loaderBackButton && <ImgLoader />}</div>
        <div>Back</div>
      </button>
      {numbersForPagination.map((item) => (
        <button
          onClick={() => loadAnotherPage(item)}
          className={item === params.page ? 'active' : ''}
          disabled={item === params.page}
          key={item}>
          {item}
        </button>
      ))}
      <button
        className="navigation"
        onClick={() => handleNavigationNext(params.page + 1)}
        disabled={params.page === numberOfPages}>
        <div>Next</div>
        <div>{loaderNextButton && <ImgLoader />}</div>
      </button>
    </div>
  );
};

export default PaginationRest;
