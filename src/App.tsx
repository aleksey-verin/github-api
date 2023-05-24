import Wrapper from './components/ui/Wrapper';
import AppRouter from './pages/AppRouter';
import './App.css';
import { useAppDispatch } from './hooks/redux';
import { useEffect } from 'react';
import { getUserRepos, selectorUserSlice } from './store/reducers/userSlice';
import { useSelector } from 'react-redux';

function App() {
  const dispatch = useAppDispatch();
  const { user } = useSelector(selectorUserSlice);

  useEffect(() => {
    dispatch(getUserRepos(user));
  }, [dispatch, user]);

  return (
    <Wrapper>
      <AppRouter />
    </Wrapper>
  );
}

export default App;
