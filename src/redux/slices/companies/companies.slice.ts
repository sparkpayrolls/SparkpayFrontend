import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { $api } from 'src/api';
import { Administrator } from 'src/api/types';
import { AppDispatch } from 'src/redux/store';

export const Companies = createSlice({
  name: 'companies',
  initialState: [] as Administrator[],
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    commitCompanies(_state, action: PayloadAction<Administrator[]>) {
      return action.payload;
    },
  },
});

export const { commitCompanies } = Companies.actions;

// const companies = await $api.company.getCompanies();
//       dispatch(commitCompanies(companies));

export const refreshCompanies = async (dispatch: AppDispatch) => {
  try {
    const companies = await $api.company.getCompanies();

    dispatch(commitCompanies(companies));
  } catch (error) {
    // error getting companies
  }
};

export default Companies.reducer;
