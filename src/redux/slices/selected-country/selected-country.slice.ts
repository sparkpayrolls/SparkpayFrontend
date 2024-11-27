import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Country } from 'src/api/types';

export const SelectedCountrySlice = createSlice({
  name: 'selectedCountry',
  initialState: null as Country | null,
  reducers: {
    commitSelectedCountry(_state, action: PayloadAction<Country | null>) {
      return action.payload;
    },
  },
});

export const { commitSelectedCountry } = SelectedCountrySlice.actions;

export default SelectedCountrySlice.reducer;
