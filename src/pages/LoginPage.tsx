import { FC } from 'react';
import MainContent from '../components/ui/MainContent';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { selectorUserAuth, userAuth, userSign } from '../store/reducers/userAuthSlice';

const LoginPage: FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useSelector(selectorUserAuth);

  const handleGithubLogin = () => {
    dispatch(userAuth(userSign.in));
  };

  return (
    <MainContent>
      {isLoading ? (
        <div>Loading..</div>
      ) : (
        <>
          <div>You can log in using your github account:</div>
          <button onClick={handleGithubLogin}>Login With GutHub</button>
        </>
      )}
    </MainContent>
  );
};

export default LoginPage;
