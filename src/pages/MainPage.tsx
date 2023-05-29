import { FC } from 'react';
import MainContent from '../components/ui/MainContent';
import { useSelector } from 'react-redux';
import { selectorUserSlice } from '../store/reducers/userReposSlice';
// import { selectorSearchReposSlice } from '../store/reducers/searchRestReposSlice';
import { selectorUserAuth } from '../store/reducers/userAuthSlice';
import FormSearch from '../components/search/FormSearch';
import ListUserRepo from '../components/search/ListUserRepo';
import ListSearchResults from '../components/search/ListSearchResults';
import PaginationRest from '../components/search/PaginationRest';
import { selectorSearchValue } from '../store/reducers/searchValueSlice';
// import { selectorSearchGraphQlReposSlice } from '../store/reducers/searchGraphQlReposSlice';
import { selectorUserSettingsSlice } from '../store/reducers/userSettingsSlice';
import { RequestTypes } from '../store/reducers/types/repoType';
import PaginationGraphQL from '../components/search/PaginationGraphQL';
import ListSearchResultsGraph from '../components/search/graph/ListSearchResultsGraph';
// import PaginationGraphQL from '../components/search/PaginationGraphQL';

const MainPage: FC = () => {
  const { userRepos, isLoading, isError } = useSelector(selectorUserSlice);
  const { user } = useSelector(selectorUserAuth);
  const { search } = useSelector(selectorSearchValue);
  // const {
  //   resultsRepos,
  //   totalCountRepos,
  //   isError: searchIsError
  // } = useSelector(selectorSearchReposSlice);
  // const {
  //   resultsReposGraphQl,
  //   totalCountReposGraphQl,
  //   isError: searchIsErrorGraphQl
  // } = useSelector(selectorSearchGraphQlReposSlice);
  const { requestType } = useSelector(selectorUserSettingsSlice);

  return (
    <MainContent>
      <FormSearch />
      {!search ? (
        <ListUserRepo user={user} userRepos={userRepos} isLoading={isLoading} isError={isError} />
      ) : (
        <>
          {requestType === RequestTypes.REST ? <ListSearchResults /> : <ListSearchResultsGraph />}
          {requestType === RequestTypes.REST ? <PaginationRest /> : <PaginationGraphQL />}
        </>
      )}
    </MainContent>
  );
};

export default MainPage;
