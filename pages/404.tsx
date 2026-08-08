import { MarketingLayout } from '@/components/marketing/marketing-layout.component';
import { MarketingButton } from '@/components/ui/marketing-button.component';
import { NextPage } from 'next';

const NotFoundPage: NextPage = () => (
  <MarketingLayout
    seo={{
      title: 'Page not found | SparkPay',
      description: 'The page you were looking for could not be found.',
      path: '/404',
    }}
  >
    <div className="mkt-404">
      <div>
        <span className="mkt-404__code mkt-figure">404</span>
        <h1 className="mkt-404__title">This page missed payday.</h1>
        <p className="mkt-404__body">
          The page you were looking for isn&rsquo;t here. Let&rsquo;s get you
          back to something useful.
        </p>
        <div className="mkt-404__links">
          <MarketingButton href="/">Back to home</MarketingButton>
          <MarketingButton href="/pricing" variant="secondary">
            See pricing
          </MarketingButton>
          <MarketingButton href="/contact" variant="secondary">
            Contact us
          </MarketingButton>
        </div>
      </div>
    </div>
  </MarketingLayout>
);

export default NotFoundPage;
