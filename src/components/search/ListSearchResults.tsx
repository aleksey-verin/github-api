import { FC } from 'react';
import RepoItem from './RepoItem';
import { RepositorySearchCommonItem, RequestTypes } from '../../store/reducers/types/repoType';
import { useSelector } from 'react-redux';
import { selectorSearchGraphQlReposSlice } from '../../store/reducers/searchGraphQlReposSlice';
import { selectorSearchReposSlice } from '../../store/reducers/searchRestReposSlice';
import { selectorUserSettingsSlice } from '../../store/reducers/userSettingsSlice';
import { selectorSearchValue } from '../../store/reducers/searchValueSlice';

interface ListSearchResultsProps {
  // search: string;
  // resultsRepos: RepositorySearchCommonItem[] | null;
  // totalCountRepos: number | null;
  // searchIsError: boolean;
}

const ListSearchResults: FC<ListSearchResultsProps> = () => {
  const {
    resultsRepos: resultsReposRest,
    totalCountRepos: totalCountReposRest,
    isError: searchIsErrorRest
  } = useSelector(selectorSearchReposSlice);
  const {
    resultsReposGraphQl,
    totalCountReposGraphQl,
    isError: searchIsErrorGraphQl
  } = useSelector(selectorSearchGraphQlReposSlice);
  const { requestType } = useSelector(selectorUserSettingsSlice);
  const { search } = useSelector(selectorSearchValue);

  const resultsRepos = requestType === RequestTypes.REST ? resultsReposRest : resultsReposGraphQl;
  const totalCountRepos =
    requestType === RequestTypes.REST ? totalCountReposRest : totalCountReposGraphQl;
  const isError = requestType === RequestTypes.REST ? searchIsErrorRest : searchIsErrorGraphQl;

  return (
    <section className="user-repositories">
      {isError && <div>Sorry, error..</div>}

      <div className="user-repositories__title">
        <span>{totalCountRepos}</span> repositories were found for the query <span>{search}</span>:
      </div>

      <div className="user-repositories__list">
        {resultsRepos?.length &&
          resultsRepos?.map(
            ({ id, name, owner: { login }, stargazerCount, languageMain, pushedAt }) => (
              <RepoItem
                key={id}
                path={id}
                repo={name}
                author={login}
                score={stargazerCount}
                language={languageMain}
                pushed_at={pushedAt}
              />
            )
          )}
      </div>
    </section>
  );
};

export default ListSearchResults;
