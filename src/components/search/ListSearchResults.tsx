import { FC } from 'react';
import RepoItem from './RepoItem';
import { RepositorySearchCommonItem } from '../../store/reducers/types/repoType';

interface ListSearchResultsProps {
  search: string;
  resultsRepos: RepositorySearchCommonItem[] | null;
  totalCountRepos: number;
  searchIsError: boolean;
}

const ListSearchResults: FC<ListSearchResultsProps> = ({
  search,
  resultsRepos,
  searchIsError,
  totalCountRepos
}) => {
  return (
    <section className="user-repositories">
      {searchIsError && <div>Sorry, error..</div>}

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
