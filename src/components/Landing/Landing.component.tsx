import { Button } from '@/components/Button/Button.component';
import { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { $api } from 'src/api';
import dashboard_preview from '../../../public/svgs/group-33971.svg';
import dashboard_preview2 from '../../../public/svgs/frame-11825.svg';
import DefaultLayout from 'src/layouts/default-layout/DefaultLayout';

export const Landing = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await $api.joinWaitList(email);
      toast.success('Successfully joined the wait list.');
      setEmail('');
    } catch (error) {
      toast.error('Please try that again.');
    }
  };

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

          <form className="hero-section__join-list" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="hero-section__join-list--input"
              placeholder="Enter your email address"
            />

            <Button
              label="Join Waitlist"
              type="submit"
              onClick={() => {}}
              primary={true}
            />
          </form>
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

            <Link href="#">
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
