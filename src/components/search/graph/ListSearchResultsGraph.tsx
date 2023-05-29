import { FC, useEffect, useState } from 'react';
import RepoItem from '../RepoItem';
import { RepositorySearchCommonItem } from '../../../store/reducers/types/repoType';
import { useSelector } from 'react-redux';
import { selectorSearchGraphQlReposSlice } from '../../../store/reducers/searchGraphQlReposSlice';
import { selectorSearchValue } from '../../../store/reducers/searchValueSlice';
import { getViewedResultsRepos } from '../../../utils/helpers';

interface ListSearchResultsGraphProps {}

const ListSearchResultsGraph: FC<ListSearchResultsGraphProps> = () => {
  const {
    resultsReposGraphQl,
    totalCountReposGraphQl,
    isError: searchIsErrorGraphQl,
    pagination: { current_page, max_pagination_items, per_page, global_count_for_request }
  } = useSelector(selectorSearchGraphQlReposSlice);
  // const { requestType } = useSelector(selectorUserSettingsSlice);
  const { search } = useSelector(selectorSearchValue);

  const [viewedData, setViewedData] = useState<RepositorySearchCommonItem[]>([]);

  useEffect(() => {
    if (!resultsReposGraphQl) return;
    setViewedData(
      getViewedResultsRepos(
        resultsReposGraphQl,
        current_page,
        per_page,
        global_count_for_request,
        max_pagination_items
      )
    );
  }, [resultsReposGraphQl, current_page, per_page, global_count_for_request, max_pagination_items]);
  console.log(viewedData);

  return (
    <section className="user-repositories">
      {searchIsErrorGraphQl && <div>Sorry, error..</div>}

      <div className="user-repositories__title">
        {viewedData && (
          <>
            <span>{totalCountReposGraphQl}</span>
            {` repositories were found for the query `}
            <span>{search}</span>
          </>
        )}
      </div>

      <div className="user-repositories__list">
        {viewedData.map(
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

export default ListSearchResultsGraph;
