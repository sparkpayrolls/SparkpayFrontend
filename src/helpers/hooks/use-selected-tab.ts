import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';

export const useSelectedTab = (defaultTab: string) => {
  const router = useRouter();
  const { tab } = router.query;

  const onTabChange = (tab: string) => {
    const { pathname, query } = router;
    const url = stringifyUrl({
      url: pathname,
      query: { ...query, tab },
    });

    router.push(url);
  };
  const selectedTab = Array.isArray(tab) ? tab[0] : tab || defaultTab;

  return { onTabChange, selectedTab };
};
