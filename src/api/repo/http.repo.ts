import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Stringifiable, stringifyUrl } from 'query-string';

import { Response } from '../types';
import { HttpError } from './http.error';

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
    config?: AxiosRequestConfig,
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
    config?: AxiosRequestConfig,
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
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<Response<T>> {
    try {
      const { data: d } = await this.$axios.delete(url, {
        data,
        ...(config || {}),
      });

      return d as Response<T>;
    } catch (error) {
      throw HttpError.parse(error as AxiosError);
    }
  }

  async patch<T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,
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
    config?: AxiosRequestConfig,
  ): Promise<Response<T>> {
    try {
      const { data } = await this.$axios.options(url, config);

      return data as Response<T>;
    } catch (error) {
      throw HttpError.parse(error as AxiosError);
    }
  }

  parseQueryObject(
    query: Record<string, Stringifiable | Stringifiable[]>,
  ): string {
    /** convert perPage to limit */
    query.limit = query.perPage;
    delete query.perPage;

    return stringifyUrl({ url: '', query });
  }
}
