import { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import logo_white from '../../../public/svgs/logo-white.svg';
import menu from '../../../public/svgs/menu.svg';
import close from '../../../public/svgs/Close.svg';
import { useState } from 'react';
import classNames from 'classnames';
import {
    // FacebookSVG,
    InstagramSVG,
    LinkedinSVG,
    SparkpaySVG,
    TwitterSVG,
} from '../../components/svg/index';
// import { useTawkto } from '../../helpers/hooks/useapicall.hook';

function getWindowDimensions() {
    if (typeof window === 'undefined') {
        return { width: 0, height: 0 };
    }
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions(),
    );

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

export const useUrl = () => {
    const [url, setUrl] = useState('https://sparkpayhq.com/');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUrl(window.location.origin + window.location.pathname);
        }
    }, []);

    return { url };
};

export const Title = (props: { title: string }) => {
    const { title } = props;

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="title" content={title} />
                <meta property="og:title" content={title} />
                <meta property="twitter:title" content={title} />
            </Head>
        </>
    );
};

const DefaultHead = () => {
    const { url } = useUrl();

    return (
        <Head>
            <meta
                name="description"
                content="SparkPay is a payroll software as a service solution geared towards bringing ease to the process of processing, creating and running payrolls."
            />
            <meta
                name="keywords"
                content="sparkpay, payroll online, online payroll, payroll, payroll processor, payroll saas, process payroll online, payroll software as a service"
            />
            <meta name="robots" content="all" />

            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta
                property="og:description"
                content="SparkPay is a payroll software as a service solution geared towards bringing ease to the process of processing, creating and running payrolls."
            />
            <meta
                property="og:image"
                content="https://res.cloudinary.com/djhmpr0bv/image/upload/v1658836812/Frame_34099_pyt6ha.png"
            />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta
                property="twitter:description"
                content="SparkPay is a payroll software as a service solution geared towards bringing ease to the process of processing, creating and running payrolls."
            />
            <meta
                property="twitter:image"
                content="https://res.cloudinary.com/djhmpr0bv/image/upload/v1658836812/Frame_34099_pyt6ha.png"
            />
        </Head>
    );
};

// eslint-disable-next-line no-undef
const DefaultLayout: React.FC = ({ children }) => {
    const [navigation, setNavigation] = useState({
        'navigation--attach': false,
        'navigation--show': false,
    });
    const { width } = useWindowDimensions();

    // useTawkto();

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

    if (typeof window === 'undefined') {
        return <DefaultHead />;
    }

    return (
        <>
            <div className='default_layout'>
                <DefaultHead />
                <header className="default-layout__header" id="top">
                    <Link href="/">
                        <a className="default-layout__header-brand">
                            <Image src={logo_white} alt="logo" />
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
                                <li className="navigation__list-item">
                                    <Link href="/login">
                                        <a className="navigation__link navigation__button navigation__button--primary">Log In</a>
                                    </Link>
                                </li>
                                <li className="navigation__list-item">
                                    <Link href="/book-a-demo">
                                        <a className="navigation__link navigation__button--primary bg-gray-200 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition">
                                            Book a demo
                                        </a>
                                    </Link>
                                </li>
                            </div>
                        </ul>
                    </nav>

                    {/* Mobile Menu Button */}
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
                                    {width < 800 ? (
                                        <Image src={logo_white} alt="logo" />
                                    ) : (
                                     <Image src={logo_white} alt="logo" />
                                    )}
                                </a>
                            </Link>

                        </div>

                        <div className="footer__column2">
                            <div className="footer__elements">
                                <h3 className="footer__title">LINKS</h3>

                                <ul>
                                    <li>
                                        <Link href="/">
                                            <a className="footer__link">Home</a>
                                        </Link>
                                    </li>

                                </ul>
                            </div>

                            <div className="footer__elements">
                                <h3 className="footer__title">TERMS OF SERVICE</h3>

                                <ul>
                                    <li>
                                        <Link href="terms&conditions">
                                            <a className="footer__link">Terms &amp; Condition</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="privacy-policy">
                                            <a className="footer__link">Privacy Policy</a>
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div className="footer__elements">
                                <h3 className="footer__title">CONTACT US</h3>

                                <ul>
                                    <li>
                                        <Link href="mailto:support@sparkpayhq.com">
                                            <a className="footer__link">support@sparkpayhq.com</a>
                                        </Link>
                                    </li>

                                    <li>
                                        <ul className="footer__social-link">


                                            <li>
                                                <Link href="https://twitter.com/Sparkpayhq">
                                                    <a target="_blank">
                                                        <TwitterSVG />
                                                    </a>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="https://www.linkedin.com/company/sparkpay-payroll/">
                                                    <a target="_blank">
                                                        <LinkedinSVG />
                                                    </a>
                                                </Link>
                                            </li>

                                            <li>
                                                <Link href="https://www.instagram.com/sparkpayhq/">
                                                    <a target="_blank">
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
            </div>

        </>
    );
};

export default DefaultLayout;