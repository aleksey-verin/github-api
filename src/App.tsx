import Wrapper from './components/ui/Wrapper';
import AppRouter from './pages/AppRouter';
import './App.css';
import { useAppDispatch } from './hooks/redux';
import { useEffect } from 'react';
import { getUserRepos } from './store/reducers/userSlice';
import { useSelector } from 'react-redux';
import { selectorUserAuth } from './store/reducers/userAuthSlice';

function App() {
  const dispatch = useAppDispatch();
  // const { user } = useSelector(selectorUserSlice);
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
