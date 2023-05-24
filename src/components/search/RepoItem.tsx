import { FC } from 'react';
import * as dayjs from 'dayjs';

interface RepoItemProps {
  repo: string;
  author: string;
  score: number;
  language: string | undefined;
  pushed_at: string;
}

const RepoItem: FC<RepoItemProps> = ({ repo, author, score, language, pushed_at }) => {
  const viewedDate = dayjs(pushed_at).format('DD.MM.YYYY HH:mm'); // '25/01/2019'

  return (
    <div className="repo-item">
      <div className="repo-item__title">
        <div>{repo}</div>
        <div>
          <a href="#">More details..</a>
        </div>
      </div>
      <div className="repo-item__content">
        <p>{`Author: ${author}`}</p>
        <p>{`Stars: ${score}`}</p>
        <p>{`Last commit: ${viewedDate}`}</p>
        <p>{`Language: ${language}`}</p>
      </div>
      <div className="repo-item__link"></div>
    </div>
  );
};

export default RepoItem;
