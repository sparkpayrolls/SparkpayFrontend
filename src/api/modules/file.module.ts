import { HttpRepository } from '../repo/http.repo';

export class FileModule extends HttpRepository {
  async parseXlsxFile<T>(dataUri: string) {
    const { data } = await this.post<T>('/files/parse/xlsx', { data: dataUri });

    return data;
  }
}
