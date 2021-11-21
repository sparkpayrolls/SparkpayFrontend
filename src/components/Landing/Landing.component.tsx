import { Button } from '@/components/Button/Button.component';
import { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';
import NiceModal from '@ebay/nice-modal-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { $api } from 'src/api';
import dashboard_preview2 from '../../../public/svgs/frame-11825.svg';
import DefaultLayout from 'src/layouts/default-layout/DefaultLayout';
import { JoinWaitListModal } from '../Modals/JoinWaitListModal.component';

export const Landing = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setShowSpinner(true);
      await $api.joinWaitList(email, name);
      NiceModal.show(JoinWaitListModal);
      setName('');
      setEmail('');
    } catch (error) {
      console.log(error);

      toast.error('Please try that again.');
    } finally {
      setShowSpinner(false);
    }
  };

  return (
    <DefaultLayout>
      <Head>
        <title>SparkPay</title>
        <meta name="description" content="Sparkpay homepage" />
      </Head>

      <main className="home">
        <section className="hero-section">
          <p className="hero-section__title">
            Payroll Made <span className="hero-section__title--em">Easy</span>
          </p>
          <p className="hero-section__subtext">
            A borderless management system that brings ease to creating payrolls
            and remitting statutory deductions.
          </p>

          <form className="hero-section__join-list" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="hero-section__join-list--input"
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="hero-section__join-list--input"
              placeholder="Email address"
            />

            <Button
              label="Join Waitlist"
              type="submit"
              onClick={() => {}}
              primary={true}
              className="hero-section__join-list--button"
              showSpinner={showSpinner}
              showLabel={!showSpinner}
            />
          </form>
        </section>

        <section className="app-preview">
          <DashboardPreviewSVG />
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

const DashboardPreviewSVG = () => {
  const src =
    'https://res.cloudinary.com/djhmpr0bv/image/upload/v1637412387/zuvqnjek7ljv9iwyvpdc.png';

  return (
    <Image
      loader={(props) => `${src}?hehehe=${props.width}`}
      src={src}
      alt="dashboard-preview"
      width={1224}
      height={668}
    />
  );
};
