import DefaultLayout, { Title } from 'src/layouts/default-layout/DefaultLayout';

export default function TermsConditions() {
  return (
    <DefaultLayout>
      <Title title="SparkPay | Terms of Use" />
      <main className="mx-auto my-10 md:my-[129px] max-w-[1140px] w-[85vw] text-['Karla'] text-[#000000] text-lg md:text-[24px] md:leading-[53px]">
        <p className="font-extrabold text-2xl  md:text-[64px] md:leading-[53px]  text-center">
          {' '}
          SparkPay Terms of Use
        </p>
        <p className="md:text-[24px] leading-[53px] pt-3">
          Last Updated: November 11, 2023
        </p>
        <div>
          <p className="font-extrabold md:text-[24px] lg:text-3xl leading-[53px] text-[#000000]">
            1. Introduction
          </p>
          <p>
            Welcome to <span className="font-bold md:text-2xl">SparkPay!</span>{' '}
            These Terms of Use (&quot;Terms&quot;) govern your use of our
            website, mobile application, and services (collectively, the
            &quot;Platform&quot;). By accessing or using the Platform, you agree
            to be bound by these Terms and our Privacy Policy.
          </p>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            2. Eligibility
          </p>
          <p>
            The Platform is intended for individuals and businesses who are at
            least 18 years old. If you are under 18, please do not use the
            Platform.
          </p>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            3. Account Registration
          </p>
          <p>
            To use certain features of the Platform, you may need to register
            for an account. You must provide accurate and complete information,
            including your name, email address, and phone number.
          </p>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            4. User Responsibilities
          </p>
          <p>
            You are responsible for:
            <br />
            Maintaining the security of your account and password
            <br /> Ensuring all information provided is accurate and up-to-date
            <br />
            Complying with all applicable laws and regulations
            <br /> Not using the Platform for illegal or fraudulent activities
          </p>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            5. Intellectual Property
          </p>
          <p>
            The Platform and all intellectual property rights, including
            trademarks, copyrights, and trade secrets, are owned by SparkPay or
            its licensors.
          </p>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            6. User Content
          </p>
          <p>
            You retain ownership of any content you submit through the Platform.
            However, by submitting such content, you grant SparkPay a worldwide,
            non-exclusive, royalty-free license to use, modify, and distribute
            it.
          </p>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            7. Prohibited Activities
          </p>
          <p>
            You may not: <br />
            Use the Platform for illegal or fraudulent activities <br />
            Infringe on SparkPay&apos;s or third party intellectual property
            rights <br />
            Interfere with or disrupt the Platform or its servers <br />
            Use the Platform to harm or exploit individuals or businesses
          </p>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            8. Termination
          </p>
          <p>
            SparkPay reserves the right to terminate or suspend your account or
            access to the Platform at any time,
            <br /> without notice, for any reason, including but not limited to:
            <ul className="list-inside pl-3 list-disc ">
              <li>
                Routine checks for fraud or other illegal activities detected
              </li>
              <li>Violation of these Terms or our Privacy Policy</li>
              <li>Inactivity or abandonment of your account</li>
              <li>Request by law enforcement or government agencies</li>
              <li>Unusual or suspicious activity detected on your account</li>
            </ul>
            We may also terminate or suspend your account if we have reason to
            believe that you have engaged in fraudulent or illegal activities,
            or if we receive a complaint or allegation that your use of the
            Platform violates these Terms or our Privacy Policy.
          </p>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            9. Disclaimer of Warranties
          </p>
          <p>
            The Platform is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis, without warranties of any kind, express or
            implied.
          </p>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            10. Limitation of Liability
          </p>
          <p>
            The Platform is intended for individuals and businesses who are at
            least 18 years old. If you are under 18, please do not use the
            Platform.
          </p>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            11. Governing Law
          </p>
          <p>
            These Terms will be governed by and construed in accordance with the
            laws of The Federal Republic of Nigeria.
          </p>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            12. Entire Agreement
          </p>
          <p>
            These Terms constitute the entire agreement between you and SparkPay
            regarding the Platform.
          </p>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            13. Changes to Terms
          </p>
          <p>
            SparkPay reserves the right to modify or update these Terms at any
            time without notice. By using the Platform, you acknowledge that you
            have read, understood, and agree to be bound by these Terms.
          </p>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            Contact Us
          </p>
          <p>
            If you have any questions or concerns about these Terms, please
            contact us at{' '}
            <span className="font-bold">admin@sparkpayhq.com</span>
          </p>
        </div>
      </main>
    </DefaultLayout>
  );
}
