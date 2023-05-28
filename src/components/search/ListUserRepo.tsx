import { FC } from 'react';
import { RepositorySearchCommonItem, UserAuth } from '../../store/reducers/types/repoType';
import RepoItem from './RepoItem';

interface ListUserRepoProps {
  user: UserAuth | null;
  userRepos: RepositorySearchCommonItem[];
  isLoading: boolean;
  isError: boolean;
}

const ListUserRepo: FC<ListUserRepoProps> = ({ user, userRepos, isLoading, isError }) => {
  return (
    <section className="user-repositories">
      <div className="user-repositories__title">
        {user
          ? 'List of your repositories:'
          : 'Please log in to the app in order to see your own repositories'}
      </div>
      {isLoading && <div>Loading..</div>}
      {isError && <div>Sorry, error..</div>}
      <div className="user-repositories__list">
        {user &&
          userRepos.map(
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

export default ListUserRepo;
