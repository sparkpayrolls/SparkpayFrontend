// import { Button } from '@/components/Button/Button.component';
// import { useState, FormEvent } from 'react';
// import { toast } from 'react-toastify';
// import NiceModal from '@ebay/nice-modal-react';
import Image from 'next/image';
import Link from 'next/link';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
// import { $api } from 'src/api';
import herosectionimg from '../../../public/svgs/hero-img.svg';
// import airbnb from '../../../public/svgs/clients/airbnb.svg';
// import amazon from '../../../public/svgs/clients/amazon.svg';
// import facebook from '../../../public/svgs/clients/facebook.svg';
// import google from '../../../public/svgs/clients/google.svg';
// import netflix from '../../../public/svgs/clients/netflix.svg';
// import uber from '../../../public/svgs/clients/uber.svg';
import working_woman from '../../../public/images/working-woman.png';
import photo from '../../../public/images/photo.png';
import coin from '../../../public/images/coin.png';
import coin_mobile from '../../../public/images/coin-mobile.png';
import DefaultLayout, { Title } from 'src/layouts/default-layout/DefaultLayout';
// import { JoinWaitListModal } from '../Modals/JoinWaitListModal.component';
import {
  // ServicePointSVG,
  ServicePointSVG2,
  ServicePointSVG3,
  ServicePointSVG4,
  ServicePointSVG5,
  // ServicePointSVG6,
  VideoSVG,
  // CheckMarkSVG,
  QuoteSVG,
  FiveStarSVG,
} from '../svg';

export const Landing = () => {
  // const [email, setEmail] = useState('');
  // const [name, setName] = useState('');
  // const [showSpinner, setShowSpinner] = useState(false);

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   try {
  //     setShowSpinner(true);
  //     await $api.joinWaitList(email, name);
  //     NiceModal.show(JoinWaitListModal);
  //     setName('');
  //     setEmail('');
  //   } catch (error) {
  //     console.log(error);

  //     toast.error('Please try that again.');
  //   } finally {
  //     setShowSpinner(false);
  //   }
  // };

  const responsive = {
    mobile: {
      breakpoint: { max: 3000, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <DefaultLayout>
      <Title title="SparkPay | Payroll with ease" />
      <main className="home">
        <section className="hero-section">
          <div className="hero-section__text-column">
            <h1 className="hero-section__text">
              We have made Payroll simple for your business.
            </h1>

            <p className="hero-section__subtext">
              Complete payroll operations in a few clicks; We offer
              user-friendly tools and services that make payroll processing
              easier, faster, and less expensive for your company.
            </p>

            <div className="hero-section__cta">
              <Link href="#">
                <a className="hero-section__link hero-section__link--onboard">
                  Get Started
                </a>
              </Link>

              <Link href="#">
                <a className="hero-section__link hero-section__link--demo">
                  <VideoSVG /> See how SparkPay works (4mins)
                </a>
              </Link>
            </div>
          </div>

          <Image src={herosectionimg} alt="dashboard preview" />
        </section>

        {/* <section className="clients">
          <h2 className="clients__sub-header sub-header">
            We are trusted by the following companies
          </h2>
          <p className="clients__subtext">
            It's time-consuming to outsource payroll handling or make monthly
            direct bank transactions. Our clients have a better alternative to
            manual computation with SparkPay.
          </p>

          <div className="clients__identities">
            <Image src={airbnb} alt="airbnb logo" />
            <Image src={amazon} alt="amazon logo" />
            <Image src={facebook} alt="facebook logo" />
            <Image src={google} alt="google logo" />
            <Image src={netflix} alt="netflix logo" />
            <Image src={uber} alt="uber logo" />
          </div>
        </section> */}

        <section className="services">
          <div className="services__text-group">
            <h2 className="sub-header">Our services</h2>
            <p className="services__subtext ">
              Services engineered to make your payroll experience seamless.
            </p>
          </div>

          <div className="services__features">
            <div className="services__card">
              <ServicePointSVG3 />

              <h3 className="services__feature-title">Disbursement</h3>
              <p className="services__feature-subtext">
                Set up automated payments and basic salary deductions to ensure
                that your employees are paid on time.
              </p>
            </div>
            <div className="services__card">
              <ServicePointSVG2 />

              <h3 className="services__feature-title">Taxes</h3>
              <p className="services__feature-subtext">
                Stay in compliance with local laws by using the tax, benefits,
                and compliance solutions we provide for your employees.
              </p>
            </div>
            <div className="services__card">
              <ServicePointSVG5 />

              <h3 className="services__feature-title">Pension</h3>
              <p className="services__feature-subtext">
                Deduct your pension from your employee&apos;s income and remit
                it to the right channels if required. (coming soon)
              </p>
            </div>
            <div className="services__card">
              <ServicePointSVG4 />

              <h3 className="services__feature-title">
                24/7 Assistance customer service
              </h3>
              <p className="services__feature-subtext">
                Contact our technical support assistants, accessible 24 hours a
                day, 7 days a week to help and support you.
              </p>
            </div>
            {/* <div className="services__card">
              <ServicePointSVG5 />

              <h3 className="services__feature-title">Disbursement</h3>
              <p className="services__feature-subtext">
                Lorem ipsum dolor sit amert plerusa consectetur vred adipiscing
                tortor donec deauteir accumsan nibh turpis treu massa, donec
                deaut consectetu adipiscing tortor benelit.
              </p>
            </div>
            <div className="services__card">
              <ServicePointSVG6 />

              <h3 className="services__feature-title">Disbursement</h3>
              <p className="services__feature-subtext">
                Lorem ipsum dolor sit amert plerusa consectetur vred adipiscing
                tortor donec deauteir accumsan nibh turpis treu massa, donec
                deaut consectetu adipiscing tortor benelit.
              </p>
            </div> */}
          </div>
        </section>

        <section className="join-us">
          <div className="join-us__card">
            <h3 className="join-us__text">
              We are changing the narratives for businesses
            </h3>
            <p className="join-us__subtext">
              Your business is about to take a seat with the most efficient
              businesses on the globe with SparkPay
            </p>

            {/* <ul className="join-us__list">
              <li className="join-us__list-item">
                <CheckMarkSVG />
                <div>
                  2,400 <br />
                  <span>Transactions</span>
                </div>
              </li>

              <li className="join-us__list-item">
                <CheckMarkSVG />
                <div>
                  190 <br />
                  <span>Partners</span>
                </div>
              </li>

              <li className="join-us__list-item">
                <CheckMarkSVG />
                <div>
                  600 <br />
                  <span>Partners</span>
                </div>
              </li>

              <li className="join-us__list-item">
                <CheckMarkSVG />
                <div>
                  1,500 <br />
                  <span>Transactions</span>
                </div>
              </li>

              <li className="join-us__list-item">
                <CheckMarkSVG />
                <div>
                  92 <br />
                  <span>Partners</span>
                </div>
              </li>
            </ul> */}
          </div>

          <div className="join-us__image">
            <Image src={working_woman} alt="working woman" />
          </div>
        </section>

        <section className="focus-content">
          <div className="focus-content__image">
            <Image src={coin} alt="coin" />
          </div>

          <div className="focus-content__text">
            <h3 className="focus-content__text-title sub-header">
              Focus on your business while we handle your Payroll.
            </h3>

            <div className="focus-content__image-mobile">
              <Image src={coin_mobile} alt="coin" />
            </div>

            <p className="focus-content__text-paragraph">
              Payroll management is an integral part of every business. SparkPay
              relieves your HR and financial teams of the strain of manual
              payroll management.
              <br />
              <br />
              With our automated payroll system, you can handle all aspects of
              employee payment in a few clicks, including pensions, health
              insurance, taxes, commissions, bonuses, and incentives. You can
              also set up automatic payments, and our system will handle your
              payroll while you focus on other things.
              <br />
              <br />
              You don&apos;t require any prior payroll management experience.
              Our system is simple to use, and we offer 24/7 support if you ever
              need it.
              <br />
              <br />
              SparkPay can handle all of your payroll needs.
            </p>
          </div>
        </section>

        <section className="demo-section">
          <div className="demo-section__content">
            <h3 className="demo-section__title">
              Watch how we run Payroll in few minutes
            </h3>
            <p className="demo-section__text">
              To learn how simple payroll with SparkPay can be, watch our quick
              video tour.
            </p>

            <Link href="#">
              <a className="hero-section__link hero-section__link--demo">
                <VideoSVG /> See how SparkPay works (4mins)
              </a>
            </Link>
          </div>
        </section>

        <section className="testimonial">
          <div className="testimonial__column1">
            <h3 className="testimonial__title">
              Powering the growth of multiple business &amp; retailers.
            </h3>

            <p className="testimonial__subtext">
              From single store, startups, to large multi-national brands.
            </p>
          </div>

          <div className="testimonial__column2">
            <div className="testimonial__icons">
              <QuoteSVG />

              <FiveStarSVG />
            </div>

            <Carousel
              responsive={responsive}
              autoPlay={true}
              autoPlaySpeed={5000}
              ssr={true} // means to render carousel on server-side.
              infinite={true}
              showDots={false}
            >
              <div>
                <p className="testimonial__qoute">
                  “Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Scelerisque mus sed feugiat urna arcu feugiat senectus. Cursus
                  arcu id cum mauris, ac nulla elit. Ultricies id feugiat vitae
                  viverra tellus, tortor risus pulvinar 1...”
                </p>

                <div className="testimonial__profile">
                  <div className="testimonial__profile-avatar">
                    <Image src={photo} alt="avatar" />
                  </div>

                  <div className="testimonial__profile-details">
                    <span className="testimonial__profile-name">
                      Fabian Anderson
                    </span>
                    <span className="testimonial__profile-position">
                      Head of Products, Andela
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="testimonial__qoute">
                  “Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Scelerisque mus sed feugiat urna arcu feugiat senectus. Cursus
                  arcu id cum mauris, ac nulla elit. Ultricies id feugiat vitae
                  viverra tellus, tortor risus pulvinar 2...”
                </p>

                <div className="testimonial__profile">
                  <div className="testimonial__profile-avatar">
                    <Image src={photo} alt="avatar" />
                  </div>

                  <div className="testimonial__profile-details">
                    <span className="testimonial__profile-name">
                      Fabian Anderson
                    </span>
                    <span className="testimonial__profile-position">
                      Head of Products, Andela
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="testimonial__qoute">
                  “Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Scelerisque mus sed feugiat urna arcu feugiat senectus. Cursus
                  arcu id cum mauris, ac nulla elit. Ultricies id feugiat vitae
                  viverra tellus, tortor risus pulvinar 3...”
                </p>

                <div className="testimonial__profile">
                  <div className="testimonial__profile-avatar">
                    <Image src={photo} alt="avatar" />
                  </div>

                  <div className="testimonial__profile-details">
                    <span className="testimonial__profile-name">
                      Fabian Anderson
                    </span>
                    <span className="testimonial__profile-position">
                      Head of Products, Andela
                    </span>
                  </div>
                </div>
              </div>
            </Carousel>
          </div>
        </section>

        <section className="newsletter">
          <div className="newsletter__text-content">
            <h3 className="newsletter__title">Join Our Newsletter</h3>
            <p className="newsletter__text">
              We want to share exciting stuff with you so join our mailing list
              to stay updated whenever we drop something new.
            </p>
          </div>

          <form className="newsletter__form">
            <input
              type="email"
              className="newsletter__form-input"
              placeholder="Enter your email address"
            />
            <button type="submit" className="newsletter__form-btn">
              SUBCSRIBE
            </button>
          </form>
        </section>
      </main>
    </DefaultLayout>
  );
};

// const DashboardPreviewSVG = () => {
//   const src =
//     'https://res.cloudinary.com/djhmpr0bv/image/upload/v1637412387/zuvqnjek7ljv9iwyvpdc.png';

//   return (
//     <Image
//       loader={(props) => `${src}?hehehe=${props.width}`}
//       src={src}
//       alt="dashboard-preview"
//       width={1224}
//       height={668}
//     />
//   );
// };
