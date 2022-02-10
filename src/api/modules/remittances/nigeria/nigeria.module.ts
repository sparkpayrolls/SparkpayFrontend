import { AxiosInstance } from 'axios';
import { HttpRepository } from 'src/api/repo/http.repo';
import { TaxModule } from './tax.module';

export class NigeriaModule extends HttpRepository {
  tax: TaxModule;
  constructor($api: AxiosInstance) {
    super($api);

    this.tax = new TaxModule($api);
  }
}
