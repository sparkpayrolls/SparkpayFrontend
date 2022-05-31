import NiceModal from '@ebay/nice-modal-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../../public/svgs/logo.svg';
import menu from '../../../public/svgs/menu.svg';
import close from '../../../public/svgs/Close.svg';
import { useState } from 'react';
import classNames from 'classnames';
import { RequestAccessModal } from '@/components/Modals/RequestAccessModal.component';

// eslint-disable-next-line no-undef
const DefaultLayout: React.FC = ({ children }) => {
  const [navigation, setNavigation] = useState({
    'navigation--attach': false,
    'navigation--show': false,
  });
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
      <footer className="default-layout__footer">
        <p className="default-layout__footer-text">
          2021 SparkPay - All Rights Reserved.
        </p>
      </footer>
    </>
  );
};

export default DefaultLayout;
