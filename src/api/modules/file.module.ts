import { HttpRepository } from '../repo/http.repo';
import { File, FileUploadPayload } from '../types';

export class FileModule extends HttpRepository {
  async parseXlsxFile<T>(dataUri: string) {
    const { data } = await this.post<T>('/files/parse/xlsx', { data: dataUri });

    return data;
  }

  async uploadTemporaryFile(file: FileUploadPayload) {
    const { data } = await this.post<File>('/files/upload/temporary', file);

    return data;
  }

  async parseSavedXlsxFile<T>(id: string) {
    const { data } = await this.get<T>(`/files/${id}/parse/xlsx`);

    return data;
  }
}
