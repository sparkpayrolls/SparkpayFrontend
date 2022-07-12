import { useEffect, useState } from 'react';
import { $api } from 'src/api';
import { Bank } from 'src/api/types';

type useBanksParams = {
  country?: string;
  all?: boolean;
};

export const useBanks = (params: useBanksParams) => {
  const { country, all } = params;
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (country) {
      setLoading(true);
      $api.payout
        .getSupportedBanks(country, { all })
        .then(({ data }) => {
          setBanks(data);
        })
        .finally(() => setLoading(false));
    }
  }, [all, country]);

  return { banks, loading };
};
