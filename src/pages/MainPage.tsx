import { FC } from 'react';
import MainContent from '../components/ui/MainContent';
import { useSelector } from 'react-redux';
import { selectorUserSlice } from '../store/reducers/userReposSlice';
import { selectorUserAuth } from '../store/reducers/userAuthSlice';
import FormSearch from '../components/search/FormSearch';
import ListUserRepo from '../components/search/ListUserRepo';
import ListSearchResults from '../components/search/rest/ListSearchResults';
import PaginationRest from '../components/search/rest/PaginationRest';
import { selectorSearchValue } from '../store/reducers/searchValueSlice';
import { selectorUserSettingsSlice } from '../store/reducers/userSettingsSlice';
import { RequestTypes } from '../store/types/repoType';
import PaginationGraphQL from '../components/search/graph/PaginationGraphQL';
import ListSearchResultsGraph from '../components/search/graph/ListSearchResultsGraph';

const MainPage: FC = () => {
  const { userRepos, isLoading, isError } = useSelector(selectorUserSlice);
  const { user } = useSelector(selectorUserAuth);
  const { search } = useSelector(selectorSearchValue);
  const { requestType } = useSelector(selectorUserSettingsSlice);

  return (
    <MainContent>
      <FormSearch />
      {!search ? (
        <ListUserRepo
          user={user}
          userRepos={userRepos}
          isLoading={isLoading}
          isError={isError}
          requestType={requestType}
        />
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
