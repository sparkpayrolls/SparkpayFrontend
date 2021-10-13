import { Button } from '@/components/Button/Button';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import dashboard_preview from '../../public/svgs/group-33971.svg';
import dashboard_preview2 from '../../public/svgs/frame-11825.svg';
import DefaultLayout from 'src/layouts/default-layout/DefaultLayout';

const Home: NextPage = () => {
  return (
    <DefaultLayout>
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
            A borderless management system that brings ease to creating payrolls
            and remitting statutory deductions.
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
              Harmonize and upscale your payroll management system for uptimum
              performance.
            </p>

            <ul className="features__list">
              <li className="features__list-item">
                Direct payment to employees.
              </li>
              <li className="features__list-item">
                Tax remittances and pension.
              </li>
              <li className="features__list-item">
                Subgroup employees for specialised benefits.
              </li>
              <li className="features__list-item">
                Easy setup and navigation.
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
    </DefaultLayout>
  );
};

export default Home;
