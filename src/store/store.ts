import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import userReposSlice from './reducers/userReposSlice';
import repoLanguagesSlice from './reducers/repoLanguagesSlice';
import searchReposSlice from './reducers/searchReposSlice';
import userAuthSlice from './reducers/userAuthSlice';
import userSettingsSlice from './reducers/userSettingsSlice';
import { storage, storageSetItem } from '../utils/storage';

export const rootReducer = combineReducers({
  userReposSlice,
  repoLanguagesSlice,
  searchReposSlice,
  userAuthSlice,
  userSettingsSlice
});

export const store = configureStore({
  reducer: rootReducer
});

store.subscribe(() => {
  storageSetItem(storage.isAuth, store.getState().userAuthSlice.isAuth);
  storageSetItem(storage.userAuth, store.getState().userAuthSlice.user);
  storageSetItem(storage.searchValue, store.getState().searchReposSlice.search);
  storageSetItem(storage.searchResults, store.getState().searchReposSlice.resultsRepos);
  storageSetItem(storage.searchParamsPerPage, store.getState().searchReposSlice.params.per_page);
  storageSetItem(storage.searchParamsPage, store.getState().searchReposSlice.params.page);
  storageSetItem(storage.searchPages, store.getState().searchReposSlice.numberOfPages);
});

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
