import { HttpRepository } from "../repo/http.repo";
import { User } from "../types";

export class UserModule extends HttpRepository {
  async getProfile() {
    const { data } = await this.get<User>("/users/me");

    return data;
  }
}
