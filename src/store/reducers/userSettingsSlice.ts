import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IRootState } from '../store';
import { storage, storageGetItem } from '../../utils/storage';

interface initialStateTypes {
  isThemeLight: boolean;
  searchDebounce: number;
}

const initialState = {
  isThemeLight: storageGetItem(storage.theme) || false,
  searchDebounce: 2000
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
    }
  }
});

export const selectorUserSettingsSlice = (state: IRootState) => state.userSettingsSlice;
export const { setThemeLight, setThemeDark, setSearchDebounce } = userSettingsSlice.actions;
export default userSettingsSlice.reducer;
