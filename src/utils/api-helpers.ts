export const getSearchUrl = (searchValue: string): URL | void => {
  const _url = new URL('https://api.github.com/search/repositories');
  if (!searchValue) return;
  _url.searchParams.append('q', searchValue);
  return _url;
};

// export const getCommentsUrl = (postId: string | number): string => {
//   return `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
// };
