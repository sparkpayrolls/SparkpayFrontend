import debounce from 'lodash.debounce';
import { useState, useCallback, useEffect } from 'react';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { Util } from '../util';

type usePayoutDetailsValidationParams<T extends Record<string, unknown>> = {
  method: string;
  meta?: T;
};

let lastCallId = '';
export const usePayoutDetailsValidation = <
  T extends Record<string, unknown>,
  K
>(
  params: usePayoutDetailsValidationParams<T>,
) => {
  const { method, meta } = params;
  const [result, setResult] = useState<K>();
  const [error, setError] = useState<HttpError>();
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validate = useCallback(
    debounce(async (method, meta) => {
      if (method && meta) {
        setLoading(true);
        const callId = Math.random().toString(32).substring(2);
        lastCallId = callId;
        $api.payout
          .validatePayoutMethod<K>(method, meta)
          .then((result) => {
            if (callId === lastCallId) {
              setResult(result);
              setError(undefined);
            }
          })
          .catch((error) => {
            if (callId === lastCallId) {
              Util.onNonAuthError(error, setError);
            }
          })
          .finally(() => setLoading(false));
      }
    }, 500),
    [],
  );

  useEffect(() => {
    validate(method, meta);

    return () => {
      validate.cancel();
    };
  }, [meta, method, validate]);

  return { result, error, loading };
};
