import { useCallback, useState } from 'react';

type IUseApiCall = [boolean, () => void, () => void];

const useApiCall = (): IUseApiCall => {
  const [apiCalls, setApiCalls] = useState(0);

  const apiCallStarted = useCallback(() => {
    setApiCalls((calls) => calls + 1);
  }, []);

  const apiCallDone = useCallback(() => {
    setApiCalls((calls) => {
      const newValue = calls - 1;

      return newValue < 0 ? 0 : newValue;
    });
  }, []);

  return [apiCalls > 0, apiCallStarted, apiCallDone];
};

export default useApiCall;
