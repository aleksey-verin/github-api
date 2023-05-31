import { FC, useMemo, useState } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getPaginationForGraph } from '../../../utils/helpers';
import { useSelector } from 'react-redux';
import { selectorUserAuth } from '../../../store/reducers/userAuthSlice';
import { selectorSearchValue } from '../../../store/reducers/searchValueSlice';
import {
  searchGraphQlRepos,
  selectorSearchGraphQlReposSlice,
  setCurrentPage,
  setGlobalCountForRequest
} from '../../../store/reducers/searchGraphQlReposSlice';
import { PageInfo } from '../../../store/types/reposGraphQlTypes';
import { GraphQlRequestType } from '../../../store/types/repoType';
import ImgLoader from '../../ui/image/ImgLoader';

const PaginationGraphQL: FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector(selectorUserAuth);
  const { search } = useSelector(selectorSearchValue);
  const {
    totalCountReposGraphQl,
    paramsGraph: { per_request },
    pagination: { max_pagination_items, global_count_for_request, current_page, numberOfPages },
    pageInfo,
    isLoading
  } = useSelector(selectorSearchGraphQlReposSlice);
  const [loaderNextButton, setLoaderNextButton] = useState(false);
  const [loaderBackButton, setLoaderBackButton] = useState(false);

  const requestNextOrPrevReposGraphQlApi = async (
    value: string,
    token: string | undefined,
    per_request: number,
    type: GraphQlRequestType,
    pageInfo: PageInfo
  ) => {
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
  };

  const handlePaginationClick = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleNextButton = async (currentPage: number) => {
    // if (isLoading || !pageInfo.hasNextPage) return;
    if (isLoading) return;

    if (currentPage % 5 === 0) {
      setLoaderNextButton(true);
      await requestNextOrPrevReposGraphQlApi(
        search,
        user?.oauthAccessToken,
        per_request,
        GraphQlRequestType.next,
        pageInfo
      );
      dispatch(setGlobalCountForRequest(global_count_for_request + 1));
      dispatch(setCurrentPage(currentPage + 1));
      setLoaderNextButton(false);
    } else {
      handlePaginationClick(currentPage + 1);
    }
  };

  const handlePrevButton = async (currentPage: number) => {
    if (isLoading || (!pageInfo.hasPreviousPage && currentPage === 1)) return;
    if (currentPage !== 1 && (currentPage - 1) % 5 === 0) {
      console.log('there will be request prev');
      setLoaderBackButton(true);
      await requestNextOrPrevReposGraphQlApi(
        search,
        user?.oauthAccessToken,
        per_request,
        GraphQlRequestType.previous,
        pageInfo
      );
      dispatch(setGlobalCountForRequest(global_count_for_request - 1));
      dispatch(setCurrentPage(currentPage - 1));
      setLoaderBackButton(false);
    } else {
      handlePaginationClick(currentPage - 1);
    }
  };

  const numbersForPagination = useMemo(
    () => getPaginationForGraph(max_pagination_items, global_count_for_request, numberOfPages),
    [max_pagination_items, global_count_for_request, numberOfPages]
  );

  if (!totalCountReposGraphQl) return null;

  return (
    <div className="pagination-graph">
      <button
        disabled={current_page === 1}
        onClick={() => handlePrevButton(current_page)}
        className="pagination-graph__back">
        <div>{loaderBackButton && <ImgLoader />}</div>
        <div>Back</div>
      </button>
      <div className="pagination-graph__numbers">
        {numbersForPagination.map((item) => (
          <button
            onClick={() => handlePaginationClick(item)}
            className={item === current_page ? 'active' : ''}
            disabled={item === current_page || isLoading}
            key={item}>
            {item}
          </button>
        ))}
      </div>
      <button
        onClick={() => handleNextButton(current_page)}
        disabled={current_page === numberOfPages}
        className="pagination-graph__next">
        <div>Next</div>
        <div>{loaderNextButton && <ImgLoader />}</div>
      </button>
    </div>
  );
};

export default PaginationGraphQL;
