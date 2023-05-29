import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IRootState } from '../store';
import { storage, storageGetItem } from '../../utils/storage';
import { RequestTypes } from './types/repoType';

interface initialStateTypes {
  isThemeLight: boolean;
  searchDebounce: number;
  requestType: RequestTypes;
}

const initialState = storageGetItem(storage.settings) ?? {
  isThemeLight: false,
  searchDebounce: 1000,
  requestType: RequestTypes.GraphQl
};

export const userSettingsSlice = createSlice({
  name: 'userSettingsSlice',
  initialState: initialState as initialStateTypes,
  reducers: {
    setThemeLight: (state) => {
      state.isThemeLight = true;
    },
    setThemeDark: (state) => {
      state.isThemeLight = false;
    },
    setSearchDebounce: (state, { payload }: PayloadAction<number>) => {
      state.searchDebounce = payload;
    },
    setRequestType: (state, { payload }: PayloadAction<RequestTypes>) => {
      state.requestType = payload;
    }
  }
});

export const selectorUserSettingsSlice = (state: IRootState) => state.userSettingsSlice;
export const { setThemeLight, setThemeDark, setSearchDebounce, setRequestType } =
  userSettingsSlice.actions;
export default userSettingsSlice.reducer;
