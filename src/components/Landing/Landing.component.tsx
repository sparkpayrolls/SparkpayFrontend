// import { Button } from '@/components/Button/Button.component';
// import { useState, FormEvent } from 'react';
// import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
// import photo from '../../../public/images/photo.png';
import DefaultLayout, { Title } from 'src/layouts/default-layout/DefaultLayout';
// import { JoinWaitListModal } from '../Modals/JoinWaitListModal.component';
import {
  AutomateSVG,
  AutomationSVG,
  CheckMarkSVG,
  DisburseSVG,
  OnboardSVG,
  SecuritySVG,
  // ServicePointSVG,
  TrackSVG,
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
        <section className="hero_section">
          {/* Overlay */}
          <div className="hero_section__overlay"></div>

          {/* Main content */}
          <div className="hero_section__content">
            <div className="hero_section__grid">
              <div className="hero_section__text-column">
                <h1 className="hero_section__title">
                  Payroll for the modern workforce.
                </h1>
                <p className="hero_section__subtitle">
                  Streamline your payroll processes and empower your employees with
                  our intuitive app.
                </p>
                <Link href="/login">
                  <span className="hero_section__button">Get Started</span>
                </Link>
              </div>

              <div className="hero_section__image">
                <svg
                  className="hero_section__svg"
                  viewBox="0 0 400 400"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#0D39B6", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#0f3ebd", stopOpacity: 1 }} />
                    </linearGradient>
                    <filter height="200%" id="glow" width="200%" x="-50%" y="-50%">
                      <feGaussianBlur result="coloredBlur" stdDeviation="8" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <path
                    d="M200 50 C282.8 50 350 117.2 350 200 S282.8 350 200 350 50 282.8 50 200 117.2 50 200 50 Z"
                    fill="url(#grad1)"
                    filter="url(#glow)"
                  ></path>

                  <g transform="translate(145 150) scale(0.6)">
                    <path
                      d="M48 12C54.6274 12 60 17.3726 60 24C60 30.6274 54.6274 36 48 36C41.3726 36 36 30.6274 36 24C36 17.3726 41.3726 12 48 12Z"
                      fill="white"
                      fillOpacity="0.9"
                    />
                    <path
                      d="M120 60C126.627 60 132 65.3726 132 72C132 78.6274 126.627 84 120 84C113.373 84 108 78.6274 108 72C108 65.3726 113.373 60 120 60Z"
                      fill="white"
                      fillOpacity="0.9"
                    />
                    <path
                      d="M72 108C78.6274 108 84 113.373 84 120C84 126.627 78.6274 132 72 132C65.3726 132 60 126.627 60 120C60 113.373 65.3726 108 72 108Z"
                      fill="white"
                      fillOpacity="0.9"
                    />
                  </g>

                  <path
                    d="M150 250 L170 230 L190 250 L210 220 L230 240 L250 210"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="6"
                  />
                  <path
                    d="M120 280 C150 260 250 260 280 280"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeLinecap="round"
                    strokeOpacity="0.5"
                    strokeWidth="4"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Logo marquee */}
          <div className="hero_section__logos">
            <div className="hero_section__logos-track">
              <div className="hero_section__logos-group">
                <Image
                  width={300}
                  height={200}
                  src="/images/afrimash.jpeg"
                  alt="Transistor"
                />
                <Image
                  width={300}
                  height={200}
                  src="/images/Digital.jpeg"
                  alt="Transistor"
                />
                <Image
                  width={300}
                  height={200}
                  src="/images/Insead.jpeg"
                    alt="Transistor"
                />
                <Image
                  width={300}
                  height={200}
                  src="/images/Microsoft.jpeg"
                  alt="SavvyCal"
                />
                <Image
                  width={300}
                  height={200}
                  src="/images/HelpMum.jpeg"
                  alt="Statamic"
                />
              </div>

              <div className="hero_section__logos-group" aria-hidden="true">
                <div className="hero_section__logos-group">
                  <Image
                    src="/images/afrimash.jpeg"
                    alt="Transistor"
                    width={300}
                    height={200}
                  />
                  <Image
                    src="/images/Digital.jpeg"
                    width={300}
                    height={200}
                    alt="Transistor"
                  />
                  <Image
                    src="/images/Insead.jpeg"
                    alt="Tuple"
                    width={300}
                    height={200}
                  />
                  <Image
                    src="/images/Microsoft.jpeg"
                    alt="SavvyCal"
                    width={300}
                    height={200}
                  />
                  <Image
                    src="/images/HelpMum.jpeg"
                    alt="Statamic"
                    width={300}
                    height={200}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="why_sparkpay">
          <div className="why_sparkpay__container">
            <h2 className="why_sparkpay__title">Why Sparkpay?</h2>

            <div className="why_sparkpay__grid">
              <div className="why_sparkpay__card">
                <div className="why_sparkpay__icon">
                  <AutomationSVG />
                </div>
                <h3 className="why_sparkpay__card-title">Automated Payroll</h3>
                <p className="why_sparkpay__card-text">
                  Run payroll automatically, on time, every time. No more manual
                  calculations or spreadsheets.
                </p>
              </div>

              <div className="why_sparkpay__card">
                <div className="why_sparkpay__icon">
                  <WalletSVG />
                </div>
                <h3 className="why_sparkpay__card-title">Employee Wallets</h3>
                <p className="why_sparkpay__card-text">
                  Empower employees with digital wallets for instant access to their
                  earnings and benefits.
                </p>
              </div>

              {/* Card 3 */}
              <div className="why_sparkpay__card">
                <div className="why_sparkpay__icon">
                  <svg
                    fill="currentColor"
                    height="32"
                    viewBox="0 0 256 256"
                    width="32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.62,87.62,0,0,1-6.4,32.94l-44.7-27.49a15.92,15.92,0,0,0-6.24-2.23l-22.82-3.08a16.11,16.11,0,0,0-16,7.86h-8.72l-3.8-7.86a15.91,15.91,0,0,0-11-8.67l-8-1.73L96.14,104h16.71a16.06,16.06,0,0,0,7.73-2l12.25-6.76a16.62,16.62,0,0,0,3-2.14l26.91-24.34A15.93,15.93,0,0,0,166,49.1l-.36-.65A88.11,88.11,0,0,1,216,128ZM143.31,41.34,152,56.9,125.09,81.24,112.85,88H96.14a16,16,0,0,0-13.88,8l-8.73,15.23L63.38,84.19,74.32,58.32a87.87,87.87,0,0,1,69-17ZM40,128a87.53,87.53,0,0,1,8.54-37.8l11.34,30.27a16,16,0,0,0,11.62,10l21.43,4.61L96.74,143a16.09,16.09,0,0,0,14.4,9h1.48l-7.23,16.23a16,16,0,0,0,2.86,17.37l.14.14L128,205.94l-1.94,10A88.11,88.11,0,0,1,40,128Zm102.58,86.78,1.13-5.81a16.09,16.09,0,0,0-4-13.9,1.85,1.85,0,0,1-.14-.14L120,174.74,133.7,144l22.82,3.08,45.72,28.12A88.18,88.18,0,0,1,142.58,214.78Z"></path>
                  </svg>
                </div>
                <h3 className="why_sparkpay__card-title">Cross-Border Ready</h3>
                <p className="why_sparkpay__card-text">
                  Seamlessly manage payroll for international teams with
                  multi-currency support.
                </p>
              </div>

              <div className="why_sparkpay__card">
                <div className="why_sparkpay__icon">
                  <SecuritySVG />

                </div>
                <h3 className="why_sparkpay__card-title">Compliance & Security</h3>
                <p className="why_sparkpay__card-text">
                  Stay compliant with local regulations and ensure data security
                  with our robust platform.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="dashboard-preview">
          <div className="container">
            <div className="dashboard-card">
              <div className="dashboard-grid">

                {/* Left text content */}
                <div className="dashboard-text">
                  <h1>A powerful dashboard for employers.</h1>
                  <ul>
                    <li>
                      <span className="material-symbols-outlined"> <CheckMarkSVG /></span>
                      Salary breakdown
                    </li>
                    <li>
                      <span className="material-symbols-outlined"> <CheckMarkSVG /></span>
                      Payslip management
                    </li>
                    <li>
                      <span className="material-symbols-outlined"> <CheckMarkSVG /></span>
                      Account settings
                    </li>
                  </ul>
                <div className="btn-wrap">
  <Link href="/about-us">
    <span className="btn">Learn More</span>
  </Link>
</div>

                </div>

                <div className="dashboard-image">
                  <Image
                    src="/svgs/hero-section-img.svg"
                    alt="Sparkpay employer dashboard screenshot"
                    width={600}         // ✅ example width in pixels
                    height={400}
                  />
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <div className="container">
            <div className="how-it-works-header">
              <p className="subtitle">How it works</p>
              <h1>A simple, streamlined process.</h1>
              <p className="description">
                Our platform is designed to be intuitive and efficient, guiding you
                through each step seamlessly.
              </p>
            </div>

            <div className="how-it-works-grid">
              {/* Step 1 */}
              <div className="step">
                <div className="icon-wrapper">
                  <span className="step-number">1</span>
                  <OnboardSVG />
                </div>
                <h3>Onboard employees fast</h3>
                <p>Digital onboarding + login</p>
              </div>

              {/* Step 2 */}
              <div className="step">
                <div className="icon-wrapper">
                  <span className="step-number">2</span>
                  <AutomateSVG />
                </div>
                <h3>Automate salary runs</h3>
                <p>Breakdowns, deductions, approvals</p>
              </div>

              {/* Step 3 */}
              <div className="step">
                <div className="icon-wrapper">
                  <span className="step-number">3</span>
                  <DisburseSVG />
                </div>
                <h3>Disburse instantly</h3>
                <p>Bank, mobile wallet, crypto</p>
              </div>

              {/* Step 4 */}
              <div className="step">
                <div className="icon-wrapper">
                  <span className="step-number">4</span>
                  <TrackSVG />
                </div>
                <h3>Track &amp; report</h3>
                <p>Dashboard analytics + payslip history</p>
              </div>
            </div>
          </div>
        </section>
        <section className="testimonials">
          <div className="container">
            <div className="testimonials-header">
              <h2>What our clients say</h2>
              <p>
                Hear from businesses that have transformed their payments with
                Sparkpay.
              </p>
            </div>

            <div className="testimonials-grid">
              {/* Testimonial 1 */}
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <div className="testimonial-client">
                    <div>
                      <h3>Isaiah</h3>
                      <p>HR ZEODigitals</p>
                    </div>
                  </div>
                  <blockquote>
                    <p>
                      {`"Sparkpay has revolutionized our payment processing. We've seen a significant improvement in transaction speeds and a reduction in errors. Their platform is intuitive and their support is top-notch."`}
                    </p>
                  </blockquote>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <div className="testimonial-client">
                    <div>
                      <h3>Blessing</h3>
                      <p>HR Clyp Technologies</p>
                    </div>
                  </div>
                  <blockquote>
                    <p>
                      {`"The integration of Sparkpay into our existing systems was seamless. Their team provided excellent support throughout the process, and we've been impressed with the platform's reliability and features."`}
                    </p>
                  </blockquote>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <div className="testimonial-client">
                    <div>
                      <h3>David</h3>
                      <p>Founder, Compas AI</p>
                    </div>
                  </div>
                  <blockquote>
                    <p>
                      {`"Sparkpay has been a game-changer. The platform is user-friendly, and the reporting tools provide valuable insights. We highly recommend Sparkpay to any business looking for a reliable payment solution."`}
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>

          </div>
        </section>
        <section className="cta">
          <div className="container">
            <div className="cta-card">
              {/* Overlay */}
              <div className="cta-overlay"></div>
              <div className="cta-bg"></div>

              {/* Content */}
              <div className="cta-content">
                <h1>
                  Payroll shouldn’t take days. <br /> Sparkpay does it in minutes.
                </h1>
                <p>
                  Emphasize the speed and efficiency of Sparkpay with our
                  streamlined payroll solution.
                </p>
                <Link href="/book-a-demo">
                  <a className="cta-button">
                    Book a demo
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="demo-section">
          <div className="demo-section__content">
            <h3 className="demo-section__title">
              Watch how we run Payroll in few minutes
            </h3>
            <p className="demo-section__text">
              To learn how simple payroll with SparkPay can be, watch our quick
              video tour.
            </p>

            <Link href="#">
              <a
                onClick={() => NiceModal.show(WalkThroughModal)}
                className="hero-section__link hero-section__link--demo"
              >
                <VideoSVG /> See how SparkPay works (4mins)
              </a>
            </Link>
          </div>
        </section> */}

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

        {/* <section className="newsletter">
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
// }