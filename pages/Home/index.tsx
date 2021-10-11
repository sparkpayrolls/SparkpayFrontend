import { Button } from '@/components/Button/Button';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import dashboard_preview from '../../public/svgs/group-33971.svg';
import dashboard_preview2 from '../../public/svgs/frame-11825.svg';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>SparkPay</title>
        <meta name="description" content="Sparkpay homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="home">
        <section className="hero-section">
          <caption className="hero-section__title">
            Payroll Made <span className="hero-section__title--em">Easy</span>
          </caption>
          <p className="hero-section__subtext">
            Lorem ipsum dolor amet, consectetur adipiscing accumsan pellentesque
            volutpat.
          </p>

          <div className="hero-section__join-list">
            <input
              type="email"
              name="email"
              className="hero-section__join-list--input"
              placeholder="Enter your email address"
            />

            <Button
              label="Join Waitlist"
              type="button"
              onClick={() => {}}
              primary={true}
            />
          </div>
        </section>

        <section className="app-preview">
          <Image
            src={dashboard_preview}
            alt="app preview"
            className="app-preview__image"
          />
        </section>

        <section className="features">
          <div>
            <h2 className="features__title">
              Focus on your business while we handle your Payroll.
            </h2>
            <p className="features__subtext">
              Adipiscing tortor, pellentesque donec deaut accumsan nibh turpis
              pellentesque donec deaut consectetur.
            </p>

            <ul className="features__list">
              <li className="features__list-item">
                Lorem ipsum sit amet adipiscing.
              </li>
              <li className="features__list-item">Adipiscing tortor.</li>
              <li className="features__list-item">
                Pellentesque donec accumsan.
              </li>
              <li className="features__list-item">
                Pellentesque donec accumsan.
              </li>
            </ul>

            <Link href="/create-account">
              <a className="features__link">Get Started</a>
            </Link>
          </div>

          <div className="features__image">
            <Image src={dashboard_preview2} alt="dashboard preview" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
