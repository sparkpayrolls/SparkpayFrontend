import type { NextPage } from 'next';
import { useAppSelector } from 'src/redux/hooks';
import { OrganisationPage } from '@/components/Organization/organisations-page';
import { OrganisationDetail } from '@/components/Organization/single-organisation-page';

const Organisations: NextPage = () => {
  const administrator = useAppSelector((state) => state.administrator);

  return !administrator ? <OrganisationPage /> : <OrganisationDetail />;
};

export default Organisations;
