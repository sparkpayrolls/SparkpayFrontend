import { AxiosInstance } from 'axios';
import { HttpRepository } from 'src/api/repo/http.repo';
import { NigeriaModule } from './nigeria/nigeria.module';

export class RemittanceModule extends HttpRepository {
  nigeria: NigeriaModule;
  constructor($api: AxiosInstance) {
    super($api);

    this.nigeria = new NigeriaModule($api);
  }
}
