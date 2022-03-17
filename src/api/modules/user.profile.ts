import { HttpRepository } from '../repo/http.repo';
import { UpdateUserPayload, User } from '../types';

export class UserModule extends HttpRepository {
  async getProfile() {
    const { data } = await this.get<User>('/users/me');

    return data;
  }

  async updateProfile(payload: UpdateUserPayload) {
    const { data } = await this.put<User>('/users/me', payload);

    return data;
  }

  getUsers(params: Record<string, any>) {
    return this.get<User[]>('/users', { params });
  }
}
