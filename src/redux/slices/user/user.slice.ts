import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'src/api/types';

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

export default CountrySlice.reducer;
