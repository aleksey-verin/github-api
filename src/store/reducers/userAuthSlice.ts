import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, IRootState } from '../store';
import { GithubAuthProvider, UserCredential, signInWithPopup } from 'firebase/auth';
import { auth } from '../../utils/fireBaseConfig';
import { UserAuth } from './types/repoType';
import { storage, storageGetItem } from '../../utils/storage';

export const userSign = {
  in: 'signIn',
  out: 'signOut'
};

interface initialStateTypes {
  isAuth: boolean;
  user: UserAuth | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface AuthResponse extends UserCredential {
  _tokenResponse: {
    email: string;
    oauthAccessToken: string;
    displayName: string;
    photoUrl: string;
    screenName: string;
  };
}

const initialState = {
  isAuth: storageGetItem(storage.isAuth) ?? false,
  user: storageGetItem(storage.userAuth) ?? null,
  isLoading: false,
  isSuccess: false,
  isError: false
};

export const userAuth = createAsyncThunk<
  { user: UserAuth | null; isAuth: boolean },
  string,
  {
    dispatch: AppDispatch;
    state: IRootState;
  }
>('userAuth', async (typeSign, thunkAPI) => {
  try {
    if (typeSign === userSign.in) {
      const provider = new GithubAuthProvider();
      const response = (await signInWithPopup(auth, provider)) as AuthResponse;
      const { email, oauthAccessToken, displayName, photoUrl, screenName } =
        response._tokenResponse;
      return {
        user: {
          displayName,
          email,
          oauthAccessToken,
          photoUrl,
          screenName
        },
        isAuth: true
      };
    } else {
      await auth.signOut();
      return { user: null, isAuth: false };
    }
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error);
  }
});

export const userAuthSlice = createSlice({
  name: 'userAuthSlice',
  initialState: initialState as initialStateTypes,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userAuth.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(
      userAuth.fulfilled,
      (state, { payload }: PayloadAction<{ user: UserAuth | null; isAuth: boolean }>) => {
        state.user = payload.user;
        state.isAuth = payload.isAuth;
        state.isLoading = false;
        state.isSuccess = true;
      }
    );
    builder.addCase(userAuth.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export const selectorUserAuth = (state: IRootState) => state.userAuthSlice;

export default userAuthSlice.reducer;
