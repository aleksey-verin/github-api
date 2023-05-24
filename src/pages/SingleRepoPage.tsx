import { FC, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectorUserSlice } from '../store/reducers/userSlice';
import MainContent from '../components/ui/MainContent';
import dayjs from 'dayjs';
import { useAppDispatch } from '../hooks/redux';
import { getRepoLanguages, selectorRepoLanguagesSlice } from '../store/reducers/repoLanguagesSlice';
import { getViewedLanguages } from '../utils/helpers';

interface SingleRepoPageProps {}

const SingleRepoPage: FC<SingleRepoPageProps> = () => {
  const dispatch = useAppDispatch();
  const { id: repo } = useParams();
  const { userRepos, isLoading, isError, isSuccess } = useSelector(selectorUserSlice);
  const currentRepo = useMemo(
    () => userRepos.find((item) => item.name === repo),
    [repo, userRepos]
  );
  const {
    languages,
    isLoading: isLoadingLanguages,
    isSuccess: isSuccessLanguages,
    isError: IsErrorLanguages
  } = useSelector(selectorRepoLanguagesSlice);

  const viewedLanguages = getViewedLanguages(languages);

  useEffect(() => {
    if (!currentRepo) return;
    dispatch(getRepoLanguages(currentRepo.languages_url));
  }, [currentRepo, dispatch]);

  console.log(currentRepo);
  const viewedDate = dayjs(currentRepo?.pushed_at).format('DD.MM.YYYY HH:mm'); // '25/01/2019'

  return (
    <MainContent>
      {isLoading && <div>Loading..</div>}
      {isError && <div>Sorry, there is Error</div>}
      {isSuccess && (
        <>
          <div className="single-title">
            Details info for repository named <span>{currentRepo?.name}</span>
          </div>
          <div className="single-repo">
            <div className="single-repo__name">
              <div>Name:</div>
              <div>{currentRepo?.name}</div>
              <div>Stars:</div>
              <div>{currentRepo?.stargazers_count}</div>
            </div>
            <div className="single-repo__author author">
              <div className="author-info">
                <div className="author-info__commit">
                  <div>Last commit:</div>
                  <div>{viewedDate}</div>
                </div>
                <div className="author-info__name">
                  <div>Author:</div>
                  <div>{currentRepo?.owner.login}</div>
                </div>
                <div className="author-info__link">
                  <div>Link:</div>
                  <div>
                    <a href={currentRepo?.owner.html_url} target="_blank">
                      {currentRepo?.owner.html_url}
                    </a>
                  </div>
                </div>
              </div>
              <div className="author-photo">
                <div className="author-photo__title">Author photo:</div>
                <div className="author-photo__photo">
                  <img src={currentRepo?.owner.avatar_url} alt="" />
                </div>
              </div>
            </div>
            <div className="single-repo__languages">
              <div>Languages:</div>
              <div>
                {isLoadingLanguages && 'Загрузка..'}
                {IsErrorLanguages && 'Ошибка при загрузке данных'}
                {isSuccessLanguages && viewedLanguages}
              </div>
            </div>
            <div className="single-repo__description">
              <div>Description:</div>
              <div>
                {currentRepo?.description ? currentRepo?.description : 'There is not description'}.
              </div>
            </div>
          </div>
        </>
      )}
    </MainContent>
  );
};

export default SingleRepoPage;