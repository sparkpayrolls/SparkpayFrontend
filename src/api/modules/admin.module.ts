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
      null,
      {
        params: { inviteToken },
      },
    );

    return data;
  }

  async rejectInvitation(inviteToken: string) {
    const { data } = await this.put<Administrator>(
      '/administrators/invites/reject',
      null,
      {
        params: { inviteToken },
      },
    );

    return data;
  }

  getAdministrators(params: Record<string, any>) {
    return this.get<Administrator[]>('/administrators', { params });
  }

  async inviteAdministrator(
    payload: Pick<Invite, 'role' | 'user' | 'email' | 'name'>,
  ) {
    const { data } = await this.post<Invite>(
      '/administrators/invitations',
      payload,
    );

    return data;
  }

  async updateAdministrator(id: string, update: Pick<Administrator, 'role'>) {
    const { data } = await this.put<Administrator>(
      `/administrators/${id}`,
      update,
    );

    return data;
  }

  async deleteAdministrator(id: string) {
    const { data } = await this.delete<Administrator>(`/administrators/${id}`);

    return data;
  }

  async getInvitations(params: Record<string, any>) {
    return this.get<Invite[]>('administrators/invitations', { params });
  }

  async withdrawInvitation(id: string) {
    const { data } = await this.put<Invite>(
      `administrators/invitations/${id}/withdraw`,
    );

    return data;
  }

  async deleteInvitation(id: string) {
    const { data } = await this.delete<Invite>(
      `administrators/invitations/${id}`,
    );

    return data;
  }
}
