import { HttpRepository } from '../repo/http.repo';
import { LoggedInUser, SignupDTO } from '../types';

export class AuthModule extends HttpRepository {
  async login(username: string, password: string): Promise<LoggedInUser> {
    const { data } = await this.post<LoggedInUser>('/auth/login', {
      username,
      password,
    });

    return data;
  }

  async signup(signupDTO: SignupDTO): Promise<LoggedInUser> {
    const { data } = await this.post<LoggedInUser>('/auth/signup', signupDTO);

    return data;
  }

  async resendEmailVerification(): Promise<void> {
    await this.post('/auth/resend-email-verification');
  }

  async verifyEmail(code: string): Promise<LoggedInUser> {
    const { data } = await this.put<LoggedInUser>('/auth/verify-email', {
      code,
    });

    return data;
  }

  async emailTaken(email: string): Promise<boolean> {
    const { data } = await this.get<{ emailTaken: boolean }>(
      `/auth/email-taken/${email}`,
    );

    return data.emailTaken;
  }

  async forgotPassword(email: string): Promise<void> {
    await this.post('/auth/forgot-password', { email });
  }

  async resetPassword(code: string, password: string): Promise<void> {
    await this.put('/auth/reset-password', { code, password });
  }
}