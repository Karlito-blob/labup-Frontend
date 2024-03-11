import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { , userName: null },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.userName = action.payload.userName;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.userName = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;