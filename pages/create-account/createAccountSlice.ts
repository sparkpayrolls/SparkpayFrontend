import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface user {
  deleted: boolean;
  email: string;
  emailVerified?: boolean;
  firstname: string;
  id: string;
  lastname: string;
  country: country;
  [propName: string]: any;
}

interface country {
  code: string;
  createdAt: string;
  currency: string;
  currencySymbol: string;
  deleted: boolean;
  id: string;
  name: string;
  updatedAt: string;
}

export interface createAccountState {
  loading: boolean;
  authenticated: boolean;
  error: string;
  user?: user | {};
}

const initialState: createAccountState = {
  authenticated: false,
  loading: false,
  error: '',
  user: {},
};

export const createAccountSlice = createSlice({
  name: 'createAccount',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    createAccountPending: (state) => {
      state.loading = true;
    },
    createAccountDone: (state) => {
      state.loading = false;
    },
    createAccountSuccess: (state, action: PayloadAction<user>) => {
      state.loading = false;
      state.authenticated = true;
      state.error = '';
      state.user = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    createAccountFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.authenticated = false;
      state.error = action.payload;
    },
  },
});

export const {
  createAccountPending,
  createAccountSuccess,
  createAccountFailure,
  createAccountDone,
} = createAccountSlice.actions;

export default createAccountSlice.reducer;
