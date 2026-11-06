import debounce from 'lodash.debounce';
import { useState, useCallback, useContext, useEffect } from 'react';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { OnboardingTokenContext } from '../onboarding-token.context';
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
  const onboardingToken = useContext(OnboardingTokenContext);
  const [result, setResult] = useState<K>();
  const [error, setError] = useState<HttpError>();
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validate = useCallback(
    debounce(async (method, meta, token?: string) => {
      if (method && meta) {
        setLoading(true);
        const callId = Math.random().toString(32).substring(2);
        lastCallId = callId;
        const validation = token
          ? $api.payout.validatePayoutMethodForOnboarding<K>(
              token,
              method,
              meta,
            )
          : $api.payout.validatePayoutMethod<K>(method, meta);
        validation
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
    validate(method, meta, onboardingToken);

    return () => {
      validate.cancel();
    };
  }, [meta, method, validate, onboardingToken]);

  return { result, error, loading };
};
