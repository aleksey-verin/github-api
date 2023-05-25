import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
// import postsSlice from './reducers/postsSlice';
// import usersSlice from './reducers/usersSlice';
// import commentsSlice from './reducers/commentsSlice';
// import themeSlice from './reducers/themeSlice';
import userSlice from './reducers/userSlice';
import repoLanguagesSlice from './reducers/repoLanguagesSlice';
import searchReposSlice from './reducers/searchReposSlice';
import userAuthSlice from './reducers/userAuthSlice';
import { storage, storageSetItem } from '../utils/storage';
// import { storage, storageSetItem } from '../utils/storage';

export const rootReducer = combineReducers({
  // postsSlice,
  // usersSlice,
  // commentsSlice,
  // themeSlice,
  userSlice,
  repoLanguagesSlice,
  searchReposSlice,
  userAuthSlice
});

export const store = configureStore({
  reducer: rootReducer
});

store.subscribe(() => {
  storageSetItem(storage.isAuth, store.getState().userAuthSlice.isAuth);
  storageSetItem(storage.userAuth, store.getState().userAuthSlice.user);
});

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
