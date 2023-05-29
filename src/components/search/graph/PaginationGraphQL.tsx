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
import { PageInfo } from '../../../store/reducers/types/reposGraphQlTypes';
import { GraphQlRequestType } from '../../../store/reducers/types/repoType';
import ImgLoader from '../../ui/ImgLoader';

interface PaginationGraphQLProps {}

const PaginationGraphQL: FC<PaginationGraphQLProps> = () => {
  const dispatch = useAppDispatch();

  const { user } = useSelector(selectorUserAuth);

  const { search } = useSelector(selectorSearchValue);
  const {
    paramsGraph: { per_request },
    pagination: { max_pagination_items, global_count_for_request, current_page, numberOfPages },
    pageInfo,
    isLoading
  } = useSelector(selectorSearchGraphQlReposSlice);
  // const {
  //   params,
  //   numberOfPages,
  //   isLoading: searchIsLoading
  // } = useSelector(selectorSearchReposSlice);
  const [loaderNextButton, setLoaderNextButton] = useState(false);
  const [loaderBackButton, setLoaderBackButton] = useState(false);

  const requestNextOrPrevReposGraphQlApi = async (
    value: string,
    token: string | undefined,
    per_request: number,
    type: GraphQlRequestType,
    pageInfo: PageInfo
  ) => {
    // dispatch(resetParamsPage());
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
    // dispatch(setSearchValue(value));
  };

  const handlePaginationClick = (page: number) => {
    // if (searchIsLoading) return;
    // dispatch(setParamsPage(page));
    // dispatch(
    //   getResultsRepos({
    //     searchValue: search,
    //     oAuthToken: user?.oauthAccessToken,
    //     params: { page: page, per_page: params.per_page }
    //   })
    // );
    dispatch(setCurrentPage(page));
  };

  const handleNextButton = async (currentPage: number) => {
    if (isLoading || !pageInfo.hasNextPage) return;
    if (currentPage % 5 === 0) {
      console.log('there will be request next');
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

  return (
    <div className="pagination">
      {/* <button>..prev 100</button> */}
      <button
        disabled={current_page === 1}
        onClick={() => handlePrevButton(current_page)}
        className="pagination-back">
        <div>{loaderBackButton && <ImgLoader />}</div>
        <div>Back</div>
      </button>
      {numbersForPagination.map((item) => (
        <button
          onClick={() => handlePaginationClick(item)}
          className={item === current_page ? 'active' : ''}
          disabled={item === current_page || isLoading}
          key={item}>
          {item}
        </button>
      ))}
      {/* <button>1</button>
      <button>2</button>
      <button>3</button>
      <button>4</button>
      <button>5</button> */}

      <button
        onClick={() => handleNextButton(current_page)}
        disabled={current_page === numberOfPages}
        className="pagination-next">
        <div>Next</div>
        <div>{loaderNextButton && <ImgLoader />}</div>
      </button>

      {/* <button>next 100..</button> */}
    </div>
  );
};

export default PaginationGraphQL;
