import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

import { Response } from "../types";
import { HttpError } from "./http.error";

export class HttpRepository {
  private $axios: AxiosInstance;

  constructor($axios: AxiosInstance) {
    this.$axios = $axios;
  }

  async request<T>(config: AxiosRequestConfig): Promise<Response<T>> {
    try {
      const { data } = await axios(config);

      return data as Response<T>;
    } catch (error) {
      throw HttpError.parse(error as AxiosError);
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<Response<T>> {
    try {
      const { data } = await this.$axios.get(url, config);

      return data as Response<T>;
    } catch (error) {
      throw HttpError.parse(error as AxiosError);
    }
  }

  async put<T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<Response<T>> {
    try {
      const { data } = await this.$axios.put(url, body, config);

      return data as Response<T>;
    } catch (error) {
      throw HttpError.parse(error as AxiosError);
    }
  }

  async post<T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<Response<T>> {
    try {
      const { data } = await this.$axios.post(url, body, config);

      return data as Response<T>;
    } catch (error) {
      throw HttpError.parse(error as AxiosError);
    }
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<Response<T>> {
    try {
      const { data } = await this.$axios.delete(url, config);

      return data as Response<T>;
    } catch (error) {
      throw HttpError.parse(error as AxiosError);
    }
  }

  async patch<T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<Response<T>> {
    try {
      const { data } = await this.$axios.patch(url, body, config);

      return data as Response<T>;
    } catch (error) {
      throw HttpError.parse(error as AxiosError);
    }
  }

  async options<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<Response<T>> {
    try {
      const { data } = await this.$axios.options(url, config);

      return data as Response<T>;
    } catch (error) {
      throw HttpError.parse(error as AxiosError);
    }
  }

  parseQueryObject(obj: Record<string, string | number | boolean>): string {
    const entries = Object.entries(obj);

    const parsed = entries.map((cur) => {
      const [key, value] = cur;

      if (typeof value === "boolean") {
        return `${key}=${value ? "true" : "false"}`;
      }

      return `${key}=${value}`;
    });

    return `?${parsed.join("&")}`;
  }
}
