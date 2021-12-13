/* eslint-disable no-unused-vars */
import { IAllowedPermissions } from '@/components/types';
import { NextRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import {
  Administrator,
  Company,
  Country,
  PaginationMeta,
  Permission,
  Role,
} from 'src/api/types';
import { DebouncedFunc } from './types';

export class Util {
  static debounce<T extends (...args: any) => any>(
    func: T,
    wait: number,
  ): DebouncedFunc<T> {
    // eslint-disable-next-line no-undef
    let timer: NodeJS.Timeout;
    let shouldInvoke = false;

    const debounced = (...args: any) => {
      clearTimeout(timer);
      if (shouldInvoke) {
        shouldInvoke = false;
        return func(...args);
      }

      timer = setTimeout(() => {
        shouldInvoke = true;
        debounced(...args);
      }, wait);
    };

    return debounced as T;
  }

  static capitalize(txt: string) {
    let [first, ...rest] = txt.split('');
    if (first) {
      first = first.toUpperCase();
    }

    return [first, ...rest].join('');
  }

  static noop = () => {
    /** noop */
  };

  static getDefaultPaginationMeta(_: Partial<PaginationMeta>): PaginationMeta {
    return {
      total: 0,
      perPage: 10,
      pageCount: 0,
      page: 1,
      pagingCounter: 1,
      hasNextPage: false,
      hasPrevPage: false,
      previousPage: null,
      nextPage: null,
      ..._,
    };
  }

  static canActivate(
    allowedPermissions: IAllowedPermissions,
    administrator: Administrator | null,
  ) {
    if (administrator?.isRoot) {
      return true;
    }

    const role = administrator?.role as Role;
    const permissions = role?.permissions as Permission[];

    const canActivate = allowedPermissions.every(([group, level]) => {
      return permissions?.some(
        (permission) =>
          permission.group === group && (level === level || level === 'write'),
      );
    });

    return canActivate;
  }

  static getCurrencySymbolFromAdministrator(
    administrator: Administrator | null,
  ) {
    const company = administrator?.company as Company;
    const country = company?.country as Country;

    return country?.currencySymbol;
  }

  static formatMoneyNumber(val: number) {
    const [num, dec] = val.toFixed(2).split('.');
    const withComma = (+num).toLocaleString();

    return `${withComma}.${dec}`;
  }

  static formatNumber(val: number) {
    return Util.formatMoneyNumber(val).split('.')[0];
  }

  static sum(vals: number[]) {
    return vals.reduce((acc, cur) => acc + cur, 0);
  }

  static getQueryArrayValue(val: string | string[] | undefined) {
    if (!val) {
      return [];
    }

    return Array.isArray(val) ? val : [val];
  }

  static redirectToLogin(router: NextRouter) {
    const url = stringifyUrl({
      url: '/login',
      query: { goto: router.pathname },
    });
    router.replace(url);
  }
}
