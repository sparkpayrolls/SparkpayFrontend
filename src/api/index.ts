import axios from "axios";

import { config } from "../helpers/config";
import { AuthModule } from "./modules/auth.module";
import { CountryModule } from "./modules/country.module";
import { UserModule } from "./modules/user.profile";

export class $api {
  static $axios = axios.create({
    baseURL: config.apiUrl,
  });

  static auth = new AuthModule($api.$axios);

  static country = new CountryModule($api.$axios);

  static user = new UserModule($api.$axios);
}

$api.$axios.interceptors.request.use((config) => {
  console.log(`[${config?.method?.toUpperCase()}] ${config.url}`);
  return config;
});
