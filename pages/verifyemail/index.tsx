import { NextPage } from "next";
import Head from "next/head";
import React from "react";
import Image from "next/image";
import inbox from "../../public/inbox.svg";

const VerifyEmail: NextPage = () => {
  return (
    <div className="verify-email">
      <Head>
        <title>Check Inbox</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="verify-email__content">
        <h1 className="verify-email__title">Check Your Inbox</h1>
        <p className="verify-email__subtext">
          {" "}
          Email verification link has been sent to your inbox{" "}
        </p>
        <Image
          src={inbox}
          alt="Picture of the inbox email"
          className="verify-email__inbox-img"
        />
        <div>
          <p className="verify-email__resend-now-subtext">Resend Now</p>
          <p className="verify-email__logout-subtext">Log Out</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;