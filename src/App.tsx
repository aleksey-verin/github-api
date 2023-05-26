import Wrapper from './components/ui/Wrapper';
import AppRouter from './components/AppRouter';
import './App.css';
import { useAppDispatch } from './hooks/useAppDispatch';
import { useEffect } from 'react';
import { getUserRepos } from './store/reducers/userReposSlice';
import { useSelector } from 'react-redux';
import { selectorUserAuth } from './store/reducers/userAuthSlice';

function App() {
  const dispatch = useAppDispatch();
  const { user } = useSelector(selectorUserAuth);

  useEffect(() => {
    if (user) {
      dispatch(getUserRepos(user.screenName));
    }
  }, [dispatch, user]);

  return (
    <Wrapper>
      <AppRouter />
    </Wrapper>
  );
}

export default App;
