import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AppDispatch, IRootState } from '../store';

import { ResponseSearch } from './types/reposGraphQlTypes';
import { GraphQLClient } from 'graphql-request';
import { querySearchRepositoriesFirstRequest } from '../../api/repositoriesGql';
import { transformGraphQlData } from '../../utils/api-helpers';
import { RepositorySearchCommonItem } from './types/repoType';

const defaultValues = {
  resultsReposGraphQl: null,
  totalCountRepos: null,
  paramsGraph: {
    per_request: 90
    // page: 1
  },

  numberOfPages: 0
};

interface initialStateTypes {
  resultsReposGraphQl: RepositorySearchCommonItem[] | null;
  totalCountRepos: number | null;
  paramsGraph: {
    per_request: number;
  };
  numberOfPages: number;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const initialState = {
  resultsReposGraphQl: defaultValues.resultsReposGraphQl,
  totalCountRepos: null,
  paramsGraph: {
    per_request: defaultValues.paramsGraph.per_request
  },
  numberOfPages: defaultValues.numberOfPages,
  isLoading: false,
  isSuccess: false,
  isError: false
};

export const searchGraphQlRepos = createAsyncThunk<
  ResponseSearch,
  { searchValue: string; oAuthToken: string; per_request: number },
  {
    dispatch: AppDispatch;
    state: IRootState;
  }
>('searchGraphQlRepos', async ({ searchValue, oAuthToken, per_request }, thunkAPI) => {
  try {
    const endpoint = `https://api.github.com/graphql`;
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${oAuthToken}`
      }
    });
    const variables = {
      request: searchValue,
      first: per_request
    };
    // const url = getSearchUrl(searchValue, params);
    // const headersList = {
    //   Accept: '*/*',
    //   Authorization: `Bearer ${oAuthToken}`
    // };
    // console.log(url);
    const data = (await graphQLClient.request(
      querySearchRepositoriesFirstRequest,
      variables
    )) as ResponseSearch;
    // if (data) {
    // const searchData = transformGraphQlData(data);
    console.log(data);
    return data;
    // } else {
    //   // return thunkAPI.rejectWithValue(data);
    // }
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error);
  }
});

export const searchGraphQlReposSlice = createSlice({
  name: 'searchReposSlice',
  initialState: initialState as initialStateTypes,
  reducers: {
    // setSearch: (state, { payload }: PayloadAction<string>) => {
    //   state.search = payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(searchGraphQlRepos.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    });
    builder.addCase(
      searchGraphQlRepos.fulfilled,
      (state, { payload }: PayloadAction<ResponseSearch>) => {
        state.resultsReposGraphQl = transformGraphQlData(payload);
        state.totalCountRepos = payload.search.repositoryCount;
        state.isLoading = false;
        state.isSuccess = true;
      }
    );
    builder.addCase(searchGraphQlRepos.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export const selectorSearchGraphQlReposSlice = (state: IRootState) => state.searchGraphQlReposSlice;
// export const {
//   setSearch,
//   clearSearch,
//   setParamsPage,
//   resetParamsPage,
//   setParamsPerPage,
//   resetParamsPerPage
// } = searchGraphQlReposSlice.actions;
export default searchGraphQlReposSlice.reducer;
