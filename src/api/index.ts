import axios, { AxiosError } from 'axios';

import { config } from '../helpers/config';
import { AuthModule } from './modules/auth.module';
import { CompanyWalletModule } from './modules/company-wallet.module';
import { CompanyModule } from './modules/company.module';
import { CountryModule } from './modules/country.module';
import { DashboardModule } from './modules/dashboard.module';
import { EmployeeModule } from './modules/employee.module';
import { UserModule } from './modules/user.profile';
import { PayrollModule } from './modules/payroll.module';
import { PaymentModule } from './modules/payment.module';
import { AuditModule } from './modules/audit.module';
import { PayoutModule } from './modules/payout.module';
import { FileModule } from './modules/file.module';
import { RemittanceModule } from './modules/remittances/remittance.module';
import { Admin } from './modules/admin.module';
import { GroupModule } from './modules/group.module';
import { RolesModule } from './modules/roles.module';
import type { useAppDispatch } from 'src/redux/hooks';
import { logOut } from 'src/redux/slices/user/user.slice';
import { commitAministrator } from 'src/redux/slices/administrator/administrator.slice';
import { refreshCompanies } from 'src/redux/slices/companies/companies.slice';
import { AuthDetails } from './types';
import Cookies from 'js-cookie';
import moment from 'moment';

let authToken: string;
let authDetails: AuthDetails;
let tokenInterceptor: number;
let authInterceptor: number;
export class $api {
  static $axios = axios.create({
    baseURL: config().apiUrl,
  });

  static registerInterceptors(
    _authToken: string,
    dispatch: ReturnType<typeof useAppDispatch>,
  ) {
    authToken = _authToken;
    authDetails = JSON.parse(Cookies.get('auth_details') || '""');

    $api.$axios.interceptors.request.eject(tokenInterceptor);
    $api.$axios.interceptors.response.eject(authInterceptor);

    tokenInterceptor = $api.$axios.interceptors.request.use(async (_config) => {
      if (
        moment(authDetails.accessTokenExpires).isBefore(moment()) &&
        moment(authDetails.refreshTokenExpires).isAfter(moment())
      ) {
        const res = await axios({
          baseURL: config().apiUrl,
          url: '/auth/tokens',
          params: { refreshToken: authDetails.refreshToken },
        }).catch(() => {
          /** invalid token */
        });
        if (res && res.data && res.data.data) {
          authDetails = res.data.data;
          authToken = authDetails.accessToken;
          Cookies.set('auth_token', authToken);
          Cookies.set('auth_details', JSON.stringify(authDetails));
        }
      }

      return {
        ..._config,
        headers: {
          ...(_config?.headers || {}),
          Authorization: `Bearer ${authToken}`,
        },
      };
    });

    authInterceptor = $api.$axios.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        switch (error.response?.status) {
          case 401: {
            logOut(dispatch);
            break;
          }
          case 403: {
            dispatch(commitAministrator(null));
            refreshCompanies(dispatch);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  static auth = new AuthModule($api.$axios);

  static country = new CountryModule($api.$axios);

  static user = new UserModule($api.$axios);

  static employee = new EmployeeModule($api.$axios);

  static company = new CompanyModule($api.$axios);

  static dashboard = new DashboardModule($api.$axios);

  static companyWallet = new CompanyWalletModule(this.$axios);

  static payroll = new PayrollModule(this.$axios);

  static payment = new PaymentModule(this.$axios);

  static payout = new PayoutModule(this.$axios);

  static audit = new AuditModule(this.$axios);

  static file = new FileModule(this.$axios);

  static remittance = new RemittanceModule(this.$axios);

  static admin = new Admin(this.$axios);

  static group = new GroupModule(this.$axios);

  static role = new RolesModule(this.$axios);

  static async joinWaitList(email: string, name: string) {
    await $api.$axios.post('/join-wait-list', { email, name });
  }
}
