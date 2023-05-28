import { FC } from 'react';
import MainContent from '../components/ui/MainContent';
import { useSelector } from 'react-redux';
import { selectorUserSlice } from '../store/reducers/userReposSlice';
import { selectorSearchReposSlice } from '../store/reducers/searchRestReposSlice';
import { selectorUserAuth } from '../store/reducers/userAuthSlice';
import FormSearch from '../components/search/FormSearch';
import ListUserRepo from '../components/search/ListUserRepo';
import ListSearchResults from '../components/search/ListSearchResults';
import PaginationRest from '../components/search/PaginationRest';
import { selectorSearchValue } from '../store/reducers/searchValueSlice';

const MainPage: FC = () => {
  const { userRepos, isLoading, isError } = useSelector(selectorUserSlice);
  const { user } = useSelector(selectorUserAuth);
  const { search } = useSelector(selectorSearchValue);
  const {
    resultsRepos,
    totalCountRepos,
    isError: searchIsError
  } = useSelector(selectorSearchReposSlice);

  return (
    <MainContent>
      <FormSearch />
      {!search ? (
        <ListUserRepo user={user} userRepos={userRepos} isLoading={isLoading} isError={isError} />
      ) : (
        <>
          <ListSearchResults
            resultsRepos={resultsRepos}
            search={search}
            searchIsError={searchIsError}
            totalCountRepos={totalCountRepos}
          />
          <PaginationRest />
        </>
      )}
    </MainContent>
  );
};

export default MainPage;
