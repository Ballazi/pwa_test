import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  role_list: [],
  user_data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setRoleList: (state, action) => {
      state.role_list = action.payload;
    },
    setUserData: (state, action) => {
      state.user_data = action.payload;
    },
    deleteRoleList: (state) => {
      state.role_list = [];
    },
  },
});

export const { setRoleList, deleteRoleList, setUserData } = userSlice.actions;

export default userSlice.reducer;
