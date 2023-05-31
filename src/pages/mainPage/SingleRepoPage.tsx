import { FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectorUserSlice } from '../../store/reducers/userReposSlice';
import MainContent from '../../components/ui/MainContent';
import dayjs from 'dayjs';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { selectorSearchReposSlice } from '../../store/reducers/searchRestReposSlice';
import { selectorSearchGraphQlReposSlice } from '../../store/reducers/searchGraphQlReposSlice';
import { RequestTypes } from '../../store/types/repoType';
import { selectorUserSettingsSlice } from '../../store/reducers/userSettingsSlice';
import { getLanguageForRepo } from '../../utils/api-helpers';
import { getLanguageObject, getViewedLanguages } from '../../utils/helpers';
import { LanguagesGraph } from '../../store/types/reposGraphQlTypes';

const SingleRepoPage: FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { userRepos, isLoading, isError, isSuccess } = useSelector(selectorUserSlice);
  const { resultsRepos } = useSelector(selectorSearchReposSlice);
  const { resultsReposGraphQl } = useSelector(selectorSearchGraphQlReposSlice);
  const { requestType } = useSelector(selectorUserSettingsSlice);

  const currentUserRepo = useMemo(
    () => userRepos.find((item) => item.id === Number(id)),
    [id, userRepos]
  );
  const currentSearchRepo = useMemo(() => {
    if (requestType === RequestTypes.REST) {
      return resultsRepos?.find((item) => item.id === Number(id));
    } else {
      return resultsReposGraphQl?.find((item) => item.id === id);
    }
  }, [id, resultsReposGraphQl, resultsRepos, requestType]);
  const currentRepo = currentUserRepo || currentSearchRepo;

  const [viewedLanguage, setViewedLanguage] = useState('');
  const [loadingLanguagesData, setLoadingLanguagesData] = useState(false);

  const getLanguageRequest = async (languageUrl: string) => {
    setLoadingLanguagesData(true);
    const data = await getLanguageForRepo(languageUrl);
    const lang = getViewedLanguages(data);
    setLoadingLanguagesData(false);
    setViewedLanguage(lang);
  };

  useEffect(() => {
    if (!currentRepo) return;
    if (currentRepo.languageMain === 'There is no information') {
      setViewedLanguage(currentRepo.languageMain);
    } else {
      if (typeof currentRepo.languages === 'string') getLanguageRequest(currentRepo.languages);
      else {
        const languageText = getViewedLanguages(
          getLanguageObject(currentRepo.languages as LanguagesGraph)
        );
        setViewedLanguage(languageText);
      }
    }
  }, [currentRepo, dispatch]);

  const viewedDate = dayjs(currentRepo?.pushedAt).format('DD.MM.YYYY HH:mm'); // '25/01/2019'

  return (
    <MainContent>
      {isLoading && <div>Loading..</div>}
      {isError && <div>Sorry, there is Error</div>}
      {(isSuccess || currentRepo) && (
        <>
          <div className="single-title">
            Details info for repository named <span>{currentRepo?.name}</span>
          </div>
          <div className="single-repo">
            <div className="single-repo__item">
              <div>Author photo:</div>
              <div className="single-repo__item-photo">
                <img src={currentRepo?.owner.avatar_url} alt="" />
              </div>
            </div>
            <div className="single-repo__item">
              <div>Name:</div>
              <div>{currentRepo?.name}</div>
            </div>
            <div className="single-repo__item">
              <div>Stars:</div>
              <div>{currentRepo?.stargazerCount}</div>
            </div>
            <div className="single-repo__item">
              <div>Last commit:</div>
              <div>{viewedDate}</div>
            </div>
            <div className="single-repo__item">
              <div>Author:</div>
              <div>{currentRepo?.owner.login}</div>
            </div>
            <div className="single-repo__item">
              <div>Link:</div>
              <div>
                <a href={currentRepo?.owner.html_url} target="_blank">
                  {currentRepo?.owner.html_url}
                </a>
              </div>
            </div>
            <div className="single-repo__item">
              <div>Languages:</div>
              <div>{loadingLanguagesData ? 'Loading languages..' : viewedLanguage}</div>
            </div>
            <div className="single-repo__item">
              <div>Description:</div>
              <div>
                {currentRepo?.description ? currentRepo?.description : 'There is no description'}.
              </div>
            </div>
          </div>
        </>
      )}
    </MainContent>
  );
};

export default SingleRepoPage;
