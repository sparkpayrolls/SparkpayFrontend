import axios from 'axios';

import { config } from '../helpers/config';
import { AuthModule } from './modules/auth.module';
import { CompanyModule } from './modules/company.module';
import { CountryModule } from './modules/country.module';
import { EmployeeModule } from './modules/employee.module';
import { UserModule } from './modules/user.profile';

export class $api {
  static $axios = axios.create({
    baseURL: config.apiUrl,
  });

  static auth = new AuthModule($api.$axios);

  static country = new CountryModule($api.$axios);

  static user = new UserModule($api.$axios);

  static employee = new EmployeeModule($api.$axios);

  static company = new CompanyModule($api.$axios);

  static async joinWaitList(email: string, name: string) {
    await $api.$axios.post('/join-wait-list', { email, name });
  }
}

$api.$axios.interceptors.request.use((config) => {
  console.log(`[${config?.method?.toUpperCase()}] ${config.url}`);
  return config;
});
