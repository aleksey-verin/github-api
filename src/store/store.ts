import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import userReposSlice from './reducers/userReposSlice';
import searchRestReposSlice from './reducers/searchRestReposSlice';
import searchGraphQlReposSlice from './reducers/searchGraphQlReposSlice';
import searchValueSlice from './reducers/searchValueSlice';
import userAuthSlice from './reducers/userAuthSlice';
import userSettingsSlice from './reducers/userSettingsSlice';
import { storage, storageSetItem } from '../utils/storage';

export const rootReducer = combineReducers({
  userReposSlice,
  searchRestReposSlice,
  userAuthSlice,
  userSettingsSlice,
  searchGraphQlReposSlice,
  searchValueSlice
});

export const store = configureStore({
  reducer: rootReducer
});

store.subscribe(() => {
  storageSetItem(storage.isAuth, store.getState().userAuthSlice.isAuth);
  storageSetItem(storage.userAuth, store.getState().userAuthSlice.user);
  storageSetItem(storage.searchValue, store.getState().searchValueSlice.search);
  storageSetItem(storage.searchResults, store.getState().searchRestReposSlice.resultsRepos);
  storageSetItem(
    storage.searchParamsPerPage,
    store.getState().searchRestReposSlice.params.per_page
  );
  storageSetItem(storage.searchParamsPage, store.getState().searchRestReposSlice.params.page);
  storageSetItem(storage.searchPages, store.getState().searchRestReposSlice.numberOfPages);
});

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
