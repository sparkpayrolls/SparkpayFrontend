import axios from 'axios';

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

export class $api {
  static $axios = axios.create({
    baseURL: config.apiUrl,
  });

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

  static async joinWaitList(email: string, name: string) {
    await $api.$axios.post('/join-wait-list', { email, name });
  }
}

$api.$axios.interceptors.request.use((config) => {
  console.log(`[${config?.method?.toUpperCase()}] ${config.url}`);
  return config;
});
