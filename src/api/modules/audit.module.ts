import { HttpRepository } from '../repo/http.repo';
import { Audit } from '../types';

export class AuditModule extends HttpRepository {
  getLogs(params: Record<string, any>) {
    const query = this.parseQueryObject(params);

    return this.get<Audit[]>(`/audits${query}`);
  }
}
