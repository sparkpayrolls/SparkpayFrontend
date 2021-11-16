import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Administrator } from 'src/api/types';

export const Administrators = createSlice({
  name: 'administrators',
  initialState: [] as Administrator[],
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    commitAministrators(_state, action: PayloadAction<Administrator[]>) {
      return action.payload;
    },
  },
});

export const { commitAministrators } = Administrators.actions;

export default Administrators.reducer;
