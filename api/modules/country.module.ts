import { HttpRepository } from "../repo/http.repo";
import { Country, PaginateParams } from "../types";

export class CountryModule extends HttpRepository {
  async getCountries(params: PaginateParams) {
    return this.get<Country[]>("/countries", { params });
  }
}
