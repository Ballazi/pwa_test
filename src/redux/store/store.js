import { configureStore } from '@reduxjs/toolkit';
import snackbarReducer from '../slices/snackbar-slice';
import userSlice from '../slices/user-slice';

const store = configureStore({
  reducer: {
    snackbar: snackbarReducer,
    user: userSlice,
  },
});

export default store;
