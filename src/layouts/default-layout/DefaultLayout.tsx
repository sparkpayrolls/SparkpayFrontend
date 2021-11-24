import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../../public/svgs/logo.svg';
// import menu from '../../../public/svgs/menu.svg';

// eslint-disable-next-line no-undef
const DefaultLayout: React.FC = ({ children }) => {
  return (
    <>
      <header className="default-layout__header" id="top">
        <Link href="/">
          <a className="default-layout__header-brand">
            <Image src={Logo} alt="" />
          </a>
        </Link>

        {/* <nav className="navigation">
          <ul className="navigation__list">
            <div className="navigation__list-section">
              <li className="navigation__list-item">
                <Link href="#">
                  <a className="navigation__link">FAQ</a>
                </Link>
              </li>
              <li className="navigation__list-item">
                <Link href="#">
                  <a className="navigation__link">Contact Us</a>
                </Link>
              </li>
            </div>

            <div className="navigation__list-section">
              <li className="navigation__list-item">
                <Link href="#">
                  <a className="navigation__link login">Log In</a>
                </Link>
              </li>
              <li className="navigation__list-item">
                <Link href="#">
                  <a className="navigation__link signin">FAQ</a>
                </Link>
              </li>
            </div>
          </ul>
        </nav> */}

        {/* //TODO Bring this back later  */}
        {/* <button className="default-layout__menu-btn">
          <Image src={menu} alt="menu icon" />
        </button> */}
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
