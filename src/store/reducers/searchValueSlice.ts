import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IRootState } from '../store';

import { storage, storageGetItem } from '../../utils/storage';

const defaultValues = {
  search: ''
};

interface initialStateTypes {
  search: string;
}

const initialState = {
  search: storageGetItem(storage.searchValue) ?? defaultValues.search
};

export const searchValueSlice = createSlice({
  name: 'searchValueSlice',
  initialState: initialState as initialStateTypes,
  reducers: {
    setSearchValue: (state, { payload }: PayloadAction<string>) => {
      state.search = payload;
    },
    clearSearchValue: (state) => {
      state.search = defaultValues.search;
    }
  }
});

export const selectorSearchValue = (state: IRootState) => state.searchValueSlice;
export const { setSearchValue, clearSearchValue } = searchValueSlice.actions;
export default searchValueSlice.reducer;
