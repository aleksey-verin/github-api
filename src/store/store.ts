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
  storageSetItem(storage.searchStoreREST, store.getState().searchRestReposSlice);
  storageSetItem(storage.searchStoreGraphQL, store.getState().searchGraphQlReposSlice);
  storageSetItem(storage.settings, store.getState().userSettingsSlice);
});

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
