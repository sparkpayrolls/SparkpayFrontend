import { HttpRepository } from '../repo/http.repo';
import {
  Country,
  PaginateParams,
  PensionFundAdministrator,
  State,
} from '../types';

export class CountryModule extends HttpRepository {
  async getCountries(params: PaginateParams) {
    const q = this.parseQueryObject(params);

    return this.get<Country[]>(`/countries${q}`);
  }

  async getStates(country: string, params: PaginateParams) {
    return this.get<State[]>(`/countries/${country}/states`, { params });
  }

  async getPFAs(country: string, params: PaginateParams) {
    return this.get<PensionFundAdministrator[]>(`/countries/${country}/pfas`, {
      params,
    });
  }
}
