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

export interface LoginState {
  loading: boolean;
  authenticated: boolean;
  error: string;
  user?: user | {};
}

const initialState: LoginState = {
  authenticated: false,
  loading: false,
  error: '',
  user: {},
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    loginPending: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<user>) => {
      // state.loading = false;
      state.authenticated = true;
      state.error = '';
      state.user = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.authenticated = false;
      state.error = action.payload;
    },
  },
});

export const { loginPending, loginSuccess, loginFailure } = loginSlice.actions;

export default loginSlice.reducer;
