"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import logo_white from "../../../public/svgs/logo-white.svg";
import menu from "../../../public/svgs/menu.svg";
import close from "../../../public/svgs/Close.svg";

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

const AboutLayout: React.FC<LayoutProps> = ({ children, title }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    return (
        <div className="about-layout">
            <Head>
                <title>{title || "About SparkPay"}</title>
                <meta name="description" content="Sparkpay About Us page" />
            </Head>

            {/* HEADER */}
            <header className="default-layout__header">
                <Link href="/">
                    <a className="default-layout__header-brand">
                        <Image src={logo_white} alt="SparkPay logo" />
                    </a>
                </Link>

                <nav className="desktop-nav">
                    <ul>
                        <li><Link href="/product"><a>Product</a></Link></li>
                        <li><Link href="/pricing"><a>Pricing</a></Link></li>
                        <li><Link href="/resources"><a>Resources</a></Link></li>
                    </ul>
                </nav>

                <div className="right-buttons">
                    <Link href="/book-a-demo"><a className="primary">Book a Demo</a></Link>
                    <Link href="/login"><a className="secondary">Login</a></Link>
                </div>

                <button onClick={toggleMobile} className="mobile-menu-btn">
                    <Image src={menu} alt="menu icon" />
                </button>

                {isMobileOpen && (
                    <div className="navigation navigation--attach navigation--show">
                        <ul className="navigation__list">
                            <button onClick={toggleMobile} className="navigation__close-button">
                                <Image src={close} alt="close icon" />
                            </button>
                            <li><Link href="/product"><a>Product</a></Link></li>
                            <li><Link href="/pricing"><a>Pricing</a></Link></li>
                            <li><Link href="/resources"><a>Resources</a></Link></li>
                            <li>
                                <Link href="/book-a-demo"><a className="navigation__button--primary">Book a Demo</a></Link>
                            </li>
                            <li>
                                <Link href="/login"><a className="navigation__button--secondary">Login</a></Link>
                            </li>
                        </ul>
                    </div>
                )}
            </header>

            {/* PAGE CONTENT */}
            <main>{children}</main>

            <footer>
                <div className="footer__copyright">
                    &copy; {new Date().getFullYear()} SparkPay - All Rights Reserved.
                </div>
            </footer>

        </div>
    );
};

export default AboutLayout;
