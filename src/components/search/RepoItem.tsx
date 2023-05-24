import { FC } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';

interface RepoItemProps {
  path: number;
  repo: string;
  author: string;
  score: number;
  language: string | undefined;
  pushed_at: string;
}

const RepoItem: FC<RepoItemProps> = ({ path, repo, author, score, language, pushed_at }) => {
  const viewedDate = dayjs(pushed_at).format('DD.MM.YYYY HH:mm'); // '25/01/2019'

  return (
    <div className="repo-item">
      <div className="repo-item__title">
        <div>{repo}</div>
        <div>
          <Link to={`${ROUTES.publicRoutes.searchPage}/${path}`}>More details..</Link>
        </div>
      </div>
      <div className="repo-item__content">
        <p>{`Author: ${author}`}</p>
        <p>{`Last commit: ${viewedDate}`}</p>
        <p>{`Main language: ${language}`}</p>
        <p>{`Stars: ${score}`}</p>
      </div>
      <div className="repo-item__link"></div>
    </div>
  );
};

export default RepoItem;
