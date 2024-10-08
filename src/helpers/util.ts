/* eslint-disable no-unused-vars */
import { IAllowedPermissions } from '@/components/types';
import { sign, verify } from 'jsonwebtoken';
import type momentNamespace from 'moment';
import { NextRouter } from 'next/router';
import pako from 'pako';
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
import { config } from './config';
import {
  DebouncedFunc,
  IgetCustomBlurHandler,
  IgetCustomChangeHandler,
} from './types';

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

    return Util.hasAllowedPermission(allowedPermissions, permissions || []);
  }

  static hasAllowedPermission(
    allowedPermissions: IAllowedPermissions,
    permissions: Permission[],
  ) {
    if (!permissions.length) {
      return false;
    }

    return !allowedPermissions.some(([group, level]) => {
      return !permissions.some(
        (permission) =>
          permission.group === group &&
          (permission.level === level || permission.level === 'write'),
      );
    });
  }

  static getCountryFromAdministrator(administrator: Administrator | null) {
    const company = administrator?.company as Company;

    return company?.country as Country;
  }

  static getCurrencySymbolFromAdministrator(
    administrator: Administrator | null,
  ) {
    return Util.getCountryFromAdministrator(administrator)?.currencySymbol;
  }

  static formatMoneyNumber(val: number, precision = 0) {
    const [num, dec] = (val || 0).toFixed(precision).split('.');
    const withComma = (+num).toLocaleString();
    if (!dec || Number(dec) === 0) {
      return withComma;
    }

    return `${withComma}.${dec}`;
  }

  static formatNumber(val = 0) {
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
    const query: any = { goto: router.asPath };
    if (router.query.inviteToken) {
      query.inviteCode = router.query.inviteToken;
    }

    const url = stringifyUrl({
      url: '/login',
      query,
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

  static getRoutesAndPermissions(): Map<string, IAllowedPermissions> {
    const map = new Map();

    map.set('/overview', [['Overview', 'read']]);
    map.set('/organisations', [['Company', 'read']]);
    map.set('/employees', [['Employee', 'read']]);
    map.set('/payroll', [['Payroll', 'read']]);
    map.set('/transactions', [['Transaction', 'read']]);
    map.set('/administrators', [['Admin', 'read']]);
    map.set('/remittances', [['Remittance', 'read']]);
    map.set('/audit', [['AuditTrail', 'read']]);

    return map;
  }

  static getAvailableRoute(administrator?: Administrator | null) {
    if (!administrator) {
      return null;
    }

    const routesAndPermissions = Util.getRoutesAndPermissions();
    const keys = routesAndPermissions.keys();
    let current = keys.next();
    while (!current.done) {
      if (
        Util.canActivate(
          routesAndPermissions.get(current.value) || [],
          administrator,
        )
      ) {
        return current.value;
      }

      current = keys.next();
    }

    return null;
  }

  static formatMoneyString(currency: string) {
    return (val?: unknown) => {
      const valTransformed = +`${val}`.replace(/[^0-9.]/gi, '');
      if (isNaN(valTransformed) || val === '') return '';

      return `${currency} ${valTransformed.toLocaleString()}`;
    };
  }

  static signPayload(payload: any) {
    const { jwtSecretKey } = config();

    return sign(payload, jwtSecretKey as string);
  }

  static decodePayload<T extends Record<string, unknown>>(payload: string) {
    const { jwtSecretKey } = config();

    try {
      const decoded = verify(payload, jwtSecretKey as string) as T & {
        iat?: string;
      };

      delete decoded.iat;

      return decoded;
    } catch (error) {
      return null;
    }
  }

  static COMPARABLE_TYPES = [
    'number',
    'string',
    'boolean',
    'bigint',
    'undefined',
    'function',
    'symbol',
  ];

  static isComparable<T>(val: T) {
    return Util.COMPARABLE_TYPES.includes(typeof val) || val === null;
  }

  static getChanges(
    paramOne: Record<string, unknown>,
    paramTwo: Record<string, unknown>,
  ) {
    const changes: Record<string, { from?: unknown; to?: unknown }> = {};
    const _getChanges = (
      _paramOne: typeof paramOne,
      _paramTwo: typeof paramTwo,
      path: string,
      _changes: typeof changes,
    ) => {
      const keys = new Set(
        Object.keys(_paramOne ?? {}).concat(Object.keys(_paramTwo ?? {})),
      );
      const uniqueKeys = keys.values();
      let uniqueKey = uniqueKeys.next();
      while (!uniqueKey.done) {
        const key = uniqueKey.value;
        const valueOne = (_paramOne || {})[key];
        const valueTwo = (_paramTwo || {})[key];
        if (valueOne !== valueTwo) {
          if (Util.isComparable(valueOne) && Util.isComparable(valueTwo)) {
            _changes[`${path}${key}`] = { from: valueOne, to: valueTwo };
          } else {
            _getChanges(
              valueOne as typeof _paramOne,
              valueTwo as typeof _paramTwo,
              `${path}${key}.`,
              _changes,
            );
          }
        }

        uniqueKey = uniqueKeys.next();
      }
    };
    _getChanges(paramOne, paramTwo, '', changes);

    return changes;
  }

  static camelCaseToTitleCase(text: string) {
    const result = text.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  static objectToDotNotation = (obj: unknown) => {
    const newObj = {} as Record<string, unknown>;
    const _objectToDotNotation = (
      _obj: unknown,
      _newObj: typeof newObj,
      path: string,
    ) => {
      if (typeof _obj !== 'object' || _obj === null) {
        newObj[path] = _obj;
        return;
      }

      Object.keys(_obj).forEach((key) => {
        const newPath = path ? `${path}.${key}` : key;
        _objectToDotNotation((_obj as typeof newObj)[key], _newObj, newPath);
      });
    };
    _objectToDotNotation(obj, newObj, '');

    return newObj;
  };

  static getCustomBlurHandler = <T extends Record<string, unknown>>(
    params: IgetCustomBlurHandler<T>,
  ) => {
    const { name, setTouched, touched } = params;

    return () => {
      setTouched({ ...touched, [name]: true });
    };
  };

  static getCustomChangeHandler = <T extends Record<string, unknown>, K>(
    params: IgetCustomChangeHandler<T>,
  ) => {
    const { name, setValues, values } = params;

    return (val: K) => {
      setValues({ ...values, [name]: val });
    };
  };

  static downloadFile({ file, name }: { file: string; name: string }) {
    const link = document.createElement('a');

    link.href = file;
    link.download = name;
    link.click();
  }

  static queuedThrottle<T extends (..._args: any) => any>(
    func: T,
    limit: number,
  ) {
    let lastCall = Date.now();

    const queuThrottled = (
      ...args: Parameters<T>
    ): ReturnType<T> | undefined => {
      const timeElasped = Date.now() - lastCall;
      if (timeElasped < limit) {
        setTimeout(queuThrottled, limit - timeElasped, ...args);
        return;
      }

      lastCall = Date.now();
      return func(...args);
    };

    return queuThrottled;
  }

  static transformYupErrorsIntoObject(errors: any): Record<string, string> {
    const validationErrors: Record<string, string> = {};

    errors.inner.forEach((error: any) => {
      if (error.path !== undefined) {
        validationErrors[error.path] = error.errors[0];
      }
    });

    return validationErrors;
  }

  static formatAccountNumber(accountNumber = '') {
    const res: string[] = [];
    let cur = '';
    let count = 3;
    accountNumber.split('').forEach((ch, i) => {
      cur += ch;

      if (cur.length === count) {
        res.push(cur);
        count = 4;
        cur = '';
      }
    });
    if (cur.length) {
      res.push(cur);
    }

    return res.join(' ');
  }

  static getPreciseNumber(val: number, precision: number) {
    return Number(val.toFixed(precision));
  }

  static WORK_DAYS = new Set([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ]);

  static calculateWorkDaysBetweenDates(
    dateOne: momentNamespace.Moment,
    dateTwo: momentNamespace.Moment,
  ) {
    const _dateOne = dateOne.clone();
    let days = 0;
    while (_dateOne.isSameOrBefore(dateTwo)) {
      if (Util.WORK_DAYS.has(_dateOne.format('dddd'))) {
        days += 1;
      }
      _dateOne.add(1, 'day');
    }

    return days;
  }

  static deflate(payload: unknown) {
    return Buffer.from(pako.deflate(JSON.stringify(payload))).toString(
      'base64',
    );
  }

  static inflate(payload: string) {
    return JSON.parse(
      pako.inflate(Buffer.from(payload, 'base64'), { to: 'string' }).toString(),
    );
  }
}
