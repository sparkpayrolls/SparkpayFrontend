// import { Button } from '@/components/Button/Button.component';
// import { useState, FormEvent } from 'react';
// import { toast } from 'react-toastify';
import NiceModal from '@ebay/nice-modal-react';
import Image from 'next/image';
import Link from 'next/link';
// import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
// import { $api } from 'src/api';
import herosectionimg from '../../../public/images/test.png';
import TeamMemberOne from "../../../public/images/emmanuel.jpg";
import TeamMemberTwo from "../../../public/images/Opeyemi.jpg";
import TeamMemberThree from "../../../public/images/Daniel.jpg"

// import airbnb from '../../../public/svgs/clients/airbnb.svg';
// import amazon from '../../../public/svgs/clients/amazon.svg';
// import facebook from '../../../public/svgs/clients/facebook.svg';
// import google from '../../../public/svgs/clients/google.svg';
// import netflix from '../../../public/svgs/clients/netflix.svg';
// import uber from '../../../public/svgs/clients/uber.svg';
// import working_woman from '../../../public/images/working-woman.png';
// import photo from '../../../public/images/photo.png';
// import coin from '../../../public/images/coin.png';
// import coin_mobile from '../../../public/images/coin-mobile.png';
import DefaultLayout, { Title } from 'src/layouts/default-layout/DefaultLayout';
// import { JoinWaitListModal } from '../Modals/JoinWaitListModal.component';
import { WalkThroughModal } from '../Modals/WalkThroughModal.component';
import {
  DollarSVG,
  SalarySVG,
  // ServicePointSVG,
  // ServicePointSVG6,
  WalletSVG,
  // CheckMarkSVG,
  // QuoteSVG,
  // FiveStarSVG,
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

  // const responsive = {
  //   mobile: {
  //     breakpoint: { max: 3000, min: 0 },
  //     items: 1,
  //     slidesToSlide: 1, // optional, default to 1.
  //   },
  // };

  return (
    <DefaultLayout>
      <Title title="SparkPay | Payroll with ease" />
      <main className="home">
        <section className="hero-section">
          <div className="hero-section__overlay">
            <div className="hero-section__content">
              <h1 className="hero-section__text">
                Payroll automation built for Africa’s workforce.
              </h1>

              <p className="hero-section__subtext">
                Sparkpay helps businesses pay employees faster, smarter, and without
                errors—while giving workers access to salary advances, financial tools,
                and cross-border payments.
              </p>

              <div className="hero-section__cta">
                <Link href="/login">
                  <a className="hero-section__link hero-section__link--login">Login</a>
                </Link>

                <div className="hero-section__cta">

                  <Link href="#">
                    <a
                      onClick={() => NiceModal.show(WalkThroughModal)}
                      className="hero-section__link hero-section__link--demo"
                    >
                      Request a demo
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
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

        <section className="about" id="about">
          <div className="about__container">
            <h2 className="about__heading">About Us</h2>
            <p className="about__intro">
              Sparkpay is a payroll automation platform designed for businesses across Africa.
              We are on a mission to simplify payroll, improve employee financial wellness,
              and connect African workforces with the global economy.
            </p>

            <h3 className="about__subheading">The Problem We Solve</h3>
            <div className="about__list">
              <p>Businesses spend too much time and money on manual payroll processes.</p>
              <p>Employees often face delays, errors, or lack of access to their earned income.</p>
              <p>
                Financial inclusion is limited, especially for workers who don’t have access to
                modern financial tools.
              </p>
            </div>

            <h3 className="about__subheading">Our Solution</h3>
            <div className="about__list">
              <p>Automate salary disbursement.</p>
              <p>Manage comppance and payroll reconciliation.</p>
              <p>
                Offer employees AI-powered financial wellness tools like salary advances,
                virtual wallets, and cross-border payment options.
              </p>
            </div>
          </div>
        </section>

        <section id="product" className="product">
          <h2 className="product__title">Product</h2>
          <h3 className="product__subtitle">How It Works</h3>

          <div className="product__features">
            <div className="feature-card">
              <div className="feature-icon"><DollarSVG/></div>
              <h4 className="feature-title">Payroll Automation</h4>
              <p className="feature-desc">Automate salary disbursement.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><WalletSVG/></div>
              <h4 className="feature-title">Employee Wallet</h4>
              <p className="feature-desc">Virtual wallets for employees.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><SalarySVG/></div>
              <h4 className="feature-title">Salary Advances</h4>
              <p className="feature-desc">Access to salary advances.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h4 className="feature-title">Cross-Border Payments</h4>
              <p className="feature-desc">Facilitate international payments.</p>
            </div>
          </div>

          <p className="product__mvp">
            We are currently in MVP stage with early pilots across select African businesses.
          </p>

          <div className="product__mockup">
            <Image src={herosectionimg} alt="dashboard preview" />
          </div>

          <div className="product__traction">
            <h3 className="traction-title">Traction</h3>
            <p className="traction-desc">Currently serving 25+ businesses and 1,000+ employees across Africa.</p>
          </div>
        </section>
        <section id="team" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
              Team
            </h2>

            <div className="space-y-3">
              <div className="flex items-start space-x-6  rounded-lg p-6  transition">
                <Image
                  src={TeamMemberTwo}
                  alt="Opeyemi Peter"
                  width={100}
                  height={100}
                  className="rounded-full border border-gray-200 shadow-sm"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Opeyemi Peter
                  </h3>
                  <p className="text-[16px] text-gray-600 font-medium">CEO</p>
                  <p className="text-[16px] text-gray-600 leading-relaxed">
                    Fortune 500 experience.{" "}
                    <Link
                      href="https://www.linkedin.com/in/opeyemi-peter-okunola/"
                    >
                      <a className="text-gray-400 font-medium no-underline hover:text-gray-900">
                        LinkedIn Profile
                      </a>
                    </Link>
                  </p>
                </div>
              </div>

              {/* Member 2 */}
              <div className="flex items-start space-x-6  rounded-lg p-6  transition">
                <Image
                  src={TeamMemberOne}
                  alt="Emmanuel Menyaga"
                  width={100}
                  height={100}
                  className="rounded-full border border-gray-200 shadow-sm"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Emmanuel Menyaga
                  </h3>
                  <p className="text-[16px] text-gray-600 font-medium">CTO</p>
                  <p className="text-[16px] text-gray-600 leading-relaxed">
                    Fintech, AI, and Web3 expert.{" "}
                    <Link
                      href="https://www.linkedin.com/in/emmanuelmenyaga/"
                    >
                     <a className="text-gray-400 font-medium no-underline hover:text-gray-900">
                        LinkedIn Profile
                      </a>
                    </Link>
                  </p>
                </div>
              </div>

              {/* Member 3 */}
              <div className="flex items-start space-x-6  rounded-lg p-6  transition">
                <div className="flex-shrink-0">
                  <Image
                    src={TeamMemberThree}
                    alt="Daniel Olaniyan"
                    width={100}
                    height={100}
                    className="rounded-full border border-gray-200 shadow-sm"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Daniel Olaniyan</h3>
                  <p className="text-[16px] text-gray-600 font-medium">
                    Co-Founder & Product Lead
                  </p>
                  <p className="text-[16px] text-gray-600 leading-relaxed">
                    Award-winning entrepreneur recognized by the U.S. Department of State and
                    Merck KGaA. 6+ years of experience leading product and operations across
                    fintech, Web3, and AI-driven platforms. 2025 Mandela Washington Fellow and
                    INSEAD AI Venture Lab Fellow.{" "}
                    <Link href="https://www.linkedin.com/in/daniel-olaniyan">
                      <a className="text-gray-400 font-medium no-underline hover:text-gray-900">
                        LinkedIn Profile
                      </a>
                    </Link>

                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
        <section className="py-14 bg-white text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
              Ready to simplify your payroll?
            </h2>

            <a
              href="#"
              className="inline-block px-8 py-3 text-white bg-blue-700 hover:bg-blue-700 rounded-lg font-semibold transition"
            >
              Join Our Beta
            </a>
          </div>
        </section>


        {/* <section className="testimonial">
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
        </section> */}
        {/* 
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
        </section> */}
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
