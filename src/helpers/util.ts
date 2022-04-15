/* eslint-disable no-unused-vars */
import { IAllowedPermissions } from '@/components/types';
import type momentNamespace from 'moment';
import { NextRouter } from 'next/router';
import { HttpError } from 'src/api/repo/http.error';
import {
  Administrator,
  Company,
  Country,
  PaginationMeta,
  Permission,
  Role,
  SalaryAddOn,
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
    if (!allowedPermissions.length) {
      return true;
    }
    if (administrator?.isRoot) {
      return true;
    }
    if (
      !administrator &&
      allowedPermissions.some(([group]) => group === 'Overview')
    ) {
      return true;
    }

    const role = administrator?.role as Role;
    const permissions = role?.permissions as Permission[];
    if (!permissions?.length) {
      return false;
    }

    const canActivate = allowedPermissions.every(([group, level]) => {
      return permissions?.some(
        (permission) =>
          permission.group === group &&
          (permission.level === level || permission.level === 'write'),
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

  static formatMoneyNumber(val: number, precision = 0) {
    const [num, dec] = val.toFixed(precision).split('.');
    const withComma = (+num).toLocaleString();
    if (!dec) {
      return withComma;
    }

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

  static async redirectToLogin(router: NextRouter) {
    const stringifyUrl = await import('query-string').then(
      (mod) => mod.stringifyUrl,
    );
    const url = stringifyUrl({
      url: '/login',
      query: { goto: router.asPath },
    });
    router.replace(url);
  }

  static prorateMonths() {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  }

  static deepEquals(objOne: any, objTwo: any): boolean {
    if (
      !['function', 'object', 'symbol'].includes(typeof objOne) ||
      objOne === null
    ) {
      return objOne === objTwo;
    }
    if (
      !['function', 'object', 'symbol'].includes(typeof objTwo) ||
      objTwo === null
    ) {
      return false;
    }

    return Object.keys(objOne).every((key) => {
      if (['function', 'object', 'symbol'].includes(typeof objOne[key])) {
        return Util.deepEquals(objOne[key], objTwo[key]);
      }

      return objTwo[key] === objOne[key];
    });
  }

  static validXLSXFileTypes() {
    return [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
  }

  static pluraliseTitle(name: string, elem: number) {
    return elem > 1 ? `${name + 's'}` : name;
  }

  static shortenNumber(num: number, precision = 0) {
    if (num < 1000) {
      return Util.formatMoneyNumber(num, precision);
    }

    if (num < 1000000) {
      return Util.formatMoneyNumber(num / 1000, precision) + 'K';
    }
    if (num < 1000000000) {
      return Util.formatMoneyNumber(num / 1000000, precision) + 'M';
    }
    if (num < 1000000000000) {
      return Util.formatMoneyNumber(num / 1000000000, precision) + 'B';
    }
    if (num < 1000000000000000) {
      return Util.formatMoneyNumber(num / 1000000000000, precision) + 'T';
    }

    return Util.formatMoneyNumber(num, precision);
  }

  static getNextAddonDate(
    payload: Pick<SalaryAddOn, 'type' | 'frequency' | 'dates' | 'startYear'>,
    moment: typeof momentNamespace,
  ) {
    let nextDate: { date: momentNamespace.Moment; days?: string[] };
    if (payload.frequency === 'once') {
      [nextDate] = payload.dates
        .map((date) => {
          return {
            date: moment()
              .month(date.month)
              .year(date.year || moment().year()),
            days: date.days,
          };
        })
        .sort((dateOne, dateTwo) =>
          dateOne.date.isBefore(dateTwo.date) ? -1 : 1,
        )
        .filter(
          (date, i, arr) =>
            date.date.isBefore(moment().subtract(1, 'minute')) ||
            i === arr.length - 1,
        );
    } else {
      const currentYear = moment().year();
      const startYear =
        payload.startYear && payload.startYear > currentYear
          ? payload.startYear
          : currentYear;
      [nextDate] = payload.dates
        .map((date) => {
          const d = moment().month(date.month).year(startYear);
          return d.isBefore(moment().subtract(1, 'minute'))
            ? { date: d.year(startYear + 1), days: date.days }
            : { date: d, days: date.days };
        })
        .sort((dateOne, dateTwo) =>
          dateOne.date.isBefore(dateTwo.date) ? -1 : 1,
        );
    }
    const { date, days = [] } = nextDate;
    if (payload.type === 'prorate') {
      const [start = '01', end = '02'] = days;

      return [
        `${date.year()}-${date.format('MM')}-${start}`,
        `${date.year()}-${date.format('MM')}-${end}`,
      ] as [string, string];
    }

    return date.format('YYYY-MM-DD');
  }

  static onNonAuthError(
    error: unknown,
    callback: (httpError: HttpError) => unknown,
  ) {
    const httpError = error as HttpError;
    if (![401, 403].includes(httpError.status)) {
      callback(httpError);
    }
  }
}
