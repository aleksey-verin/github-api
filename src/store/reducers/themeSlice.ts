// import { createSlice } from '@reduxjs/toolkit';
// import { IRootState } from '../store';
// import { storage, storageGetItem } from '../../utils/storage';

// interface initialStateTypes {
//   isThemeLight: boolean;
// }

// const initialState = {
//   isThemeLight: storageGetItem(storage.theme) || false
// };

// export const themeSlice = createSlice({
//   name: 'themeSlice',
//   initialState: initialState as initialStateTypes,
//   reducers: {
//     setThemeLight: (state) => {
//       state.isThemeLight = true;
//     },
//     setThemeDark: (state) => {
//       state.isThemeLight = false;
//     }
//   }
// });

// export const selectorThemeSlice = (state: IRootState) => state.themeSlice;
// export const { setThemeLight, setThemeDark } = themeSlice.actions;
// export default themeSlice.reducer;
