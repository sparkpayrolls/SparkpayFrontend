import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { $api } from 'src/api';
import { Country } from 'src/api/types';
import { AppDispatch } from 'src/redux/store';

export const CountriesSlice = createSlice({
  name: 'countries',
  initialState: [] as Country[],
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    commitCountries(_state, action: PayloadAction<Country[]>) {
      return action.payload;
    },
  },
});

export const { commitCountries } = CountriesSlice.actions;

export const getCountries = async (dispatch: AppDispatch) => {
  try {
    const { data: countries } = await $api.country.getCountries({
      all: true,
    });
    

    dispatch(commitCountries(countries));
  } catch (error) {
    // error getting countries
  }
};

export default CountriesSlice.reducer;
