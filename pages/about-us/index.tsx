"use client";
import React  from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckMarkSVG,
  LinkedinSVG,
  InstagramSVG,
  TwitterSVG,
} from '../../src/components/svg';
import DefaultLayout from "../../src/layouts/default-layout/DefaultLayout"

// Import team images
import DanielImg from '../../public/images/Daniel.jpg';
import OpeyemiImg from '../../public/images/Opeyemi.jpg';
import EmmanuelImg from '../../public/images/emmanuel.jpg';

const AboutUs = () => {

  const TEAM_MEMBERS = [
    {
      name: "Daniel Olaniyan",
      role: "Co-Founder & Product Lead",
      image: DanielImg,
      linkedinUrl: "https://www.linkedin.com/in/daniel-olaniyan-11225192/",
    },
    {
      name: "Opeyemi Peter",
      role: "CEO",
      image: OpeyemiImg,
      linkedinUrl: "https://www.linkedin.com/in/opeyemi-peter-okunola/",
    },
    {
      name: "Emmanuel Menyaga",
      role: "CTO",
      image: EmmanuelImg,
      linkedinUrl: "https://www.linkedin.com/in/emmanuelmenyaga/",
    },
  ];

  return (
    <DefaultLayout>
      <div className="about-us">
        {/* ABOUT US SECTION */}
        <main className="page-content">
          <section className="who-we-are" id="who-we-are">
            <h2>About Us</h2>
            <p>
              Sparkpay is a payroll automation platform designed to simplify and
              streamline payroll processes for businesses across Africa. Our mission
              is to empower businesses and their employees with efficient, transparent,
              and accessible financial tools.
            </p>
          </section>

          {/* PROBLEM & SOLUTION */}
          <div className="problem-solution">
            <section id="problem">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                The Problem We Solve
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-1 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                    <CheckMarkSVG />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Manual payroll processes are time-consuming, error-prone, and often
                    lead to delays in salary payments.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-1 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                    <CheckMarkSVG />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Many employees in Africa lack access to formal financial services,
                    hindering their financial well-being.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-1 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                    <CheckMarkSVG />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Traditional payroll systems often exclude contract workers and
                    those in the informal sector, limiting financial inclusion.
                  </p>
                </li>
              </ul>
            </section>

            <section id="solution">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Our Solution
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-1 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                    <CheckMarkSVG />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sparkpay automates salary disbursement, ensuring timely and
                    accurate payments to all employees, regardless of their employment
                    status.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-1 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                    <CheckMarkSVG />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our platform helps businesses manage compliance with local tax
                    regulations and labor laws, reducing the risk of penalties.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-1 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                    <CheckMarkSVG />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    We offer financial wellness tools, including employee wallets and
                    salary advances, to improve financial access and inclusion.
                  </p>
                </li>
              </ul>
            </section>
          </div>

          {/* PRODUCT SECTION */}
          <div className="section-wrapper">
            <section className="product-section" id="product">
              <h2>Product (How It Works)</h2>
              <div className="product-card">
                <h3>Platform Features</h3>
                <ul className="features">
                  <li>
                    <div className="check-icon"><CheckMarkSVG /></div>
                    <span>Payroll Automation</span>
                  </li>
                  <li>
                    <div className="check-icon"><CheckMarkSVG /></div>
                    <span>Employee Wallet</span>
                  </li>
                  <li>
                    <div className="check-icon"><CheckMarkSVG /></div>
                    <span>Salary Advances</span>
                  </li>
                  <li>
                    <div className="check-icon"><CheckMarkSVG /></div>
                    <span>Cross-Border Payments</span>
                  </li>
                </ul>
                <div className="development">
                  <h4>Development Stage</h4>
                  <p>
                    Sparkpay is currently in the MVP stage, with early pilots underway.
                    We are continuously refining our platform based on user feedback to
                    ensure it meets the evolving needs of businesses and employees.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* TEAM SECTION */}
          <div className="section-wrapper">
            <section className="team-section" id="team">
              <h2>Our Team</h2>
              <div className="team-grid">
                {TEAM_MEMBERS.map((member) => (
                  <div key={member.name} className="team-member">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={150}
                      height={150}
                      className="member-photo rounded-full object-cover"
                    />
                    <h4 className="member-name">{member.name}</h4>
                    <p className="member-role">{member.role}</p>
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="linkedin-link"
                    >
                      <LinkedinSVG />
                    </a>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* CONTACT SECTION */}
          <section className="contact-section" id="contact">
            <h2>Ready to streamline your payroll?</h2>
            <p>
              Contact us for more information or book a demo to see Sparkpay in action.
            </p>

            <div className="buttons">
              {/* <a href="#" className="btn-primary">
                Book a Demo
              </a> */}
               <Link href="/book-a-demo">
                                <a className="btn-primary">
                                  Book a demo
                                </a>
                              </Link>
              <a href="mailto:admin@sparkpayhq.com" className="btn-secondary">
                Contact Us: admin@sparkpayhq.com
              </a>
            </div>

            <div className="social-links">
              <Link href="https://twitter.com/Sparkpayhq">
                <a target="_blank">
                  <TwitterSVG />
                </a>
              </Link>
              <Link href="https://www.linkedin.com/company/sparkpay-payroll/">
                <a target="_blank">
                  <LinkedinSVG />
                </a>
              </Link>
              <Link href="https://www.instagram.com/sparkpayhq/">
                <a target="_blank">
                  <InstagramSVG />
                </a>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </DefaultLayout>
  );
};

export default AboutUs;
