import { ParamsSearch } from '../store/reducers/types/repoType';

export const getSearchUrl = (searchValue: string, params: ParamsSearch): URL | void => {
  const _url = new URL('https://api.github.com/search/repositories');
  if (!searchValue) return;
  _url.searchParams.append('q', searchValue);
  _url.searchParams.append('page', String(params.page));
  _url.searchParams.append('per_page', String(params.per_page));
  return _url;
};

// export const getCommentsUrl = (postId: string | number): string => {
//   return `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
// };
