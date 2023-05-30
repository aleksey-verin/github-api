export const storage = {
  isAuth: 'github-api-app-isAuth',
  userAuth: 'github-api-app-userAuth',
  searchValue: 'github-api-app-searchValue',
  searchResults: 'github-api-app-searchResults',
  searchParamsPerPage: 'github-api-app-searchParamsPerPage',
  searchParamsPage: 'github-api-app-searchParamsPage',
  searchPages: 'github-api-app-searchPages',
  searchStoreREST: 'github-api-app-searchStoreREST',
  searchStoreGraphQL: 'github-api-app-searchStoreGraphQL',
  settings: 'github-api-app-settings'
};

export const storageGetItem = (storageItem: string) => {
  try {
    const response = localStorage.getItem(storageItem);
    if (response) {
      return JSON.parse(response);
    }
  } catch (error) {
    console.log(error);
  }
};

export const storageSetItem = (storageItem: string, value: unknown) => {
  try {
    localStorage.setItem(storageItem, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

export const clearLocalStorageData = (storageData: Record<string, string>) => {
  Object.values(storageData).forEach((value) => {
    localStorage.removeItem(value);
  });
};
