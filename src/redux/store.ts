import {
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import LoginReducer from '../../pages/login/loginSlice';
import createAccountReducer from '../../pages/create-account/createAccountSlice';
import CountriesReducer from './slices/countries/countries.slice';
import UserReducer from './slices/user/user.slice';
import AdministratorReducer from './slices/administrator/administrator.slice';
import CompaniesReducer from './slices/companies/companies.slice';

const reducers = combineReducers({
  login: LoginReducer,
  createAccount: createAccountReducer,
  countries: CountriesReducer,
  user: UserReducer,
  administrator: AdministratorReducer,
  companies: CompaniesReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
