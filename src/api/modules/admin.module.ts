import { HttpRepository } from '../repo/http.repo';
import { Administrator, Invite } from '../types';

export class Admin extends HttpRepository {
  getInvites(params: Record<string, any>) {
    return this.get<Invite[]>('/administrators/invites', {
      params,
    });
  }
  async acceptInvitation(inviteToken: string) {
    const { data } = await this.put<Administrator>(
      '/administrators/invites/accept',
      {
        params: { inviteToken },
      },
    );

    return data;
  }
  async rejectInvitation(inviteToken: string) {
    const { data } = await this.put<Administrator>(
      '/administrators/invites/reject',
      {
        params: { inviteToken },
      },
    );

    return data;
  }
}
