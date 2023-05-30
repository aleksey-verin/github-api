import { FC } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';
import { getShortString } from '../../utils/helpers';

interface RepoItemProps {
  path: number | string;
  repo: string;
  author: string;
  score: number;
  language: string | undefined;
  pushed_at: string;
}

const RepoItem: FC<RepoItemProps> = ({ path, repo, author, score, language, pushed_at }) => {
  const viewedDate = dayjs(pushed_at).format('DD.MM.YYYY HH:mm'); // '25/01/2019'
  const viewedRepoName = getShortString(repo, 25);
  return (
    <div className="repo-item">
      <div className="repo-item__title">
        <div>{viewedRepoName}</div>
        {/* <div>
        </div> */}
      </div>
      <div className="repo-item__content">
        <p>{`Author: ${author}`}</p>
        <p>{`Last commit: ${viewedDate}`}</p>
        <p>{`Main language: ${language}`}</p>
        <p>{`Stars: ${score}`}</p>
      </div>
      <div className="repo-item__link">
        <Link to={`${ROUTES.searchPage}/${path}`}>More details..</Link>
      </div>
    </div>
  );
};

export default RepoItem;
