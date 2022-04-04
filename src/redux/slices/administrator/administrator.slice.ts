import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { Administrator as IAdministrator } from 'src/api/types';
import { AppDispatch } from 'src/redux/store';

export const Administrator = createSlice({
  name: 'administrators',
  initialState: null as IAdministrator | null,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    commitAministrator(_state, action: PayloadAction<IAdministrator | null>) {
      return action.payload;
    },
  },
});

export const { commitAministrator } = Administrator.actions;

export const getCurrentAdministrator = async (dispatch: AppDispatch) => {
  try {
    const admin = await $api.company.getCurrentCompany();

    dispatch(commitAministrator(admin ? admin : null));
  } catch (error) {
    const err = error as HttpError;
    if (err.status === 403) {
      dispatch(commitAministrator(null));
    }
  }
};

export default Administrator.reducer;
