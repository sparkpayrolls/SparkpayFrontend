import { useEffect } from 'react';
//@ts-ignore
import TawkTo from 'tawkto-react';
import NiceModal from '@ebay/nice-modal-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../../public/svgs/logo.svg';
import menu from '../../../public/svgs/menu.svg';
import close from '../../../public/svgs/Close.svg';
import { useState } from 'react';
import classNames from 'classnames';
import { RequestAccessModal } from '@/components/Modals/RequestAccessModal.component';
import {
  FacebookSVG,
  InstagramSVG,
  LinkedinSVG,
  SparkpaySVG,
  TwitterSVG,
} from '@/components/svg';

// eslint-disable-next-line no-undef
const DefaultLayout: React.FC = ({ children }) => {
  const [navigation, setNavigation] = useState({
    'navigation--attach': false,
    'navigation--show': false,
  });

  useEffect(() => {
    var tawk = new TawkTo('627a74667b967b11798ea98e', '1g2n5dcgr');

    tawk.onStatusChange((status: string) => {
      console.log(status);
    });
  }, []);

  const navigationClassName = classNames('navigation', navigation);

  const showNavigation = () => {
    setNavigation({ ...navigation, 'navigation--attach': true });
    setTimeout(setNavigation, 10, (navigation) => ({
      ...navigation,
      'navigation--show': true,
    }));
  };

  const hideNavigation = () => {
    setNavigation({ ...navigation, 'navigation--show': false });
    setTimeout(setNavigation, 200, (navigation) => ({
      ...navigation,
      'navigation--attach': false,
    }));
  };

  return (
    <>
      <header className="default-layout__header" id="top">
        <Link href="/">
          <a className="default-layout__header-brand">
            <Image src={Logo} alt="logo" />
          </a>
        </Link>

        <nav className={navigationClassName}>
          <div onClick={hideNavigation} className="navigation__overlay"></div>
          <ul className="navigation__list">
            <button
              onClick={hideNavigation}
              className="navigation__close-button"
            >
              <Image src={close} alt="close icon" />
            </button>
            <div className="navigation__list-section">
              <li className="navigation__list-item navigation__hide">
                <Link href="#">
                  <a className="navigation__link">FAQ</a>
                </Link>
              </li>
              <li className="navigation__list-item navigation__hide">
                <Link href="#">
                  <a className="navigation__link">Contact Us</a>
                </Link>
              </li>
            </div>

            <div className="navigation__list-section">
              <li className="navigation__list-item">
                <Link href="/login">
                  <a className="navigation__link navigation__button">Log In</a>
                </Link>
              </li>
              <li className="navigation__list-item">
                <button
                  onClick={() => NiceModal.show(RequestAccessModal)}
                  className="navigation__link navigation__button navigation__button--primary"
                >
                  Request access
                </button>
              </li>
            </div>
          </ul>
        </nav>

        <button onClick={showNavigation} className="default-layout__menu-btn">
          <Image src={menu} alt="menu icon" />
        </button>
      </header>
      {children}

      <footer className="footer">
        <section className="footer__menu">
          <div className="footer__column1">
            <Link href="/">
              <a className="default-layout__header-brand">
                <SparkpaySVG />
              </a>
            </Link>

            {/* <p className="footer__address">
              23B, Jayqueens Road, Ikeja, Lagos State, Nigeria.
            </p> */}
          </div>

          <div className="footer__column2">
            <div className="footer__elements">
              <h3 className="footer__title">LINKS</h3>

              <ul>
                <li>
                  <Link href="#">
                    <a className="footer__link">Home</a>
                  </Link>
                </li>
                {/* <li>
                  <Link href="#">
                    <a className="footer__link">About us</a>
                  </Link>
                </li> */}
                <li>
                  <Link href="#">
                    <a className="footer__link">FAQ</a>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer__elements">
              <h3 className="footer__title">TERMS OF SERVICE</h3>

              <ul>
                <li>
                  <Link href="#">
                    <a className="footer__link">Terms &amp; Condition</a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="footer__link">Privacy Policy</a>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer__elements">
              <h3 className="footer__title">CONTACT US</h3>

              <ul>
                <li>
                  <Link href="#">
                    <a className="footer__link">support@sparkpayhq.com</a>
                  </Link>
                </li>
                {/* <li>
                  <Link href="#">
                    <a className="footer__link">+234 802 100 0001</a>
                  </Link>
                </li> */}
                <li>
                  <ul className="footer__social-link">
                    <li>
                      <Link href="#">
                        <a>
                          <FacebookSVG />
                        </a>
                      </Link>
                    </li>

                    <li>
                      <Link href="#">
                        <a>
                          <TwitterSVG />
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <a>
                          <LinkedinSVG />
                        </a>
                      </Link>
                    </li>

                    <li>
                      <Link href="#">
                        <a>
                          <InstagramSVG />
                        </a>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="footer__copyright">
          &copy; {new Date().getFullYear()} SparkPay - All Rights Reserved.
        </div>
      </footer>
    </>
  );
};

export default DefaultLayout;
