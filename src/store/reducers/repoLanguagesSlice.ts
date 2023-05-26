import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AppDispatch, IRootState } from '../store';
import { Languages } from './types/repoType';

interface initialStateTypes {
  languages: Languages;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const initialState = {
  languages: {},
  isLoading: false,
  isSuccess: false,
  isError: false
};

export const getRepoLanguages = createAsyncThunk<
  Languages,
  string,
  {
    dispatch: AppDispatch;
    state: IRootState;
  }
>('getRepoLanguages', async (url, thunkAPI) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const error = await response.json();
      return thunkAPI.rejectWithValue(error?.message);
    }
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error);
  }
});

export const repoLanguagesSlice = createSlice({
  name: 'repoLanguagesSlice',
  initialState: initialState as initialStateTypes,
  reducers: {
    clearLanguage: (state) => {
      state.languages = initialState.languages;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getRepoLanguages.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(getRepoLanguages.fulfilled, (state, { payload }: PayloadAction<Languages>) => {
      state.languages = payload;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getRepoLanguages.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export const selectorRepoLanguagesSlice = (state: IRootState) => state.repoLanguagesSlice;
export const { clearLanguage } = repoLanguagesSlice.actions;
export default repoLanguagesSlice.reducer;
