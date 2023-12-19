// snackbarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  type: '',
  message: '',
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    openSnackbar: (state, action) => {
      state.open = true;
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
    closeSnackbar: (state) => {
      state.open = false;
    },
  },
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
