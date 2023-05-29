import { FC } from 'react';
import MainContent from '../components/ui/MainContent';
// import { signInWithPopup } from 'firebase/auth';
// import { auth, provider } from '../utils/fireBaseConfig';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { selectorUserAuth, userAuth, userSign } from '../store/reducers/userAuthSlice';

// const CLIENT_ID = '0c607f76c21dce697876';

// function loginWithGithub() {
//   window.location.assign('https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID);
// }

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useSelector(selectorUserAuth);

  const handleGithubLogin = () => {
    dispatch(userAuth(userSign.in));
  };

  // const handleAuth = async () => {
  //   try {
  //     const response = await fetch('https://github.com/login/oauth/authorize?scope=user:e');
  //   if (response.ok) {
  //     const data = await response.json();
  //     console.log(data);
  //     return data;
  //   } else {
  //     const error = await response.json();
  //     console.log(error);
  //   }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // useEffect(() => {
  //   const queryString = window.location.search;
  //   const urlParams = new URLSearchParams(queryString);
  //   const codeParam = urlParams.get('code');
  //   console.log(codeParam);
  // }, []);

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
