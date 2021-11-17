import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { User } from 'src/api/types';
import { AppDispatch } from 'src/redux/store';

export const CountrySlice = createSlice({
  name: 'user',
  initialState: null as User | null,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    commitUser(_state, action: PayloadAction<User | null>) {
      return action.payload;
    },
  },
});

export const { commitUser } = CountrySlice.actions;

export const logOut = (dispatch: AppDispatch) => {
  Cookies.remove('auth_token');
  dispatch(commitUser(null));
};

export default CountrySlice.reducer;
