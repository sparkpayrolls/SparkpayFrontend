import DefaultLayout, { Title } from 'src/layouts/default-layout/DefaultLayout';

export default function index() {
  return (
    <DefaultLayout>
      <Title title="Sparkpay | Privacy Policy" />
      <main className="mx-auto my-10 md:my-[129px] max-w-[1140px] w-[85vw] text-['Karla'] text-[#000000] text-lg md:text-[24px] md:leading-[53px]">
        <p className="font-extrabold text-2xl md:mb-12  md:text-[64px] md:leading-[53px]  text-center">
          {' '}
          Sparkpay Privacy Policy
        </p>
        <p className="md:text-[24px] md:leading-[53px] pt-3">
          At <span className="font-extrabold">Sparkpay</span>, we value your
          privacy and are committed to protecting your personal information.
          This privacy policy explains how we collect, use, and disclose
          information when you use our platform, website, and services.
        </p>
        <div>
          <p className="font-extrabold md:text-[24px] lg:text-3xl leading-[53px] text-[#000000]">
            Information We Collect
          </p>
          <ul className="list-inside pl-3 list-disc ">
            <li>
              Personal information that would be required to register and
              identify you including name, email, phone number, address, and
              identification documents (e.g., ID, passport) for KYC
            </li>

            <li>
              Financial information that would be required to pay you or help
              you facilitate payments including bank account details,
              transaction history, and payment information
            </li>
            <li>
              Usage information that may be necessary for audit purposes
              including - login history, search queries, and interactions with
              our platform
            </li>
          </ul>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            How We Use Your Information
          </p>
          <ul className="list-inside pl-3 list-disc ">
            <li>Provide and improve our services</li>

            <li>Process transactions and payments</li>
            <li>Verify your identity and prevent fraud</li>
            <li>Communicate with you about our services and updates</li>
            <li>Comply with legal and regulatory requirements</li>
            <li>
              Anonymize and aggregate data for analytics and research purposes
            </li>
          </ul>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            Information Sharing
          </p>
          <ul className="list-inside pl-3 list-disc ">
            <li>
              We only share your information with parties that are important for
              our solution to work for you:
            </li>

            <li>
              Financial institutions and payment processors for transactions
            </li>
            <li>
              Regulators and law enforcement agencies (as required by law)
            </li>
            <li>
              Our service providers and partners (e.g., auditors, consultants)
            </li>
            <li>In the event of a merger or acquisition</li>
          </ul>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            Data Security
          </p>
          <ul className="list-inside pl-3 list-disc ">
            <li>
              We implement appropriate technical and organizational measures to
              protect your information from unauthorized access, disclosure,
              modification, or destruction.
            </li>
          </ul>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            Data Retention
          </p>
          <ul className="list-inside pl-3 list-disc ">
            <li>
              We retain your information for as long as necessary to provide our
              services and comply with legal requirements.
            </li>
          </ul>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            Your Rights
          </p>
          <ul className="list-inside pl-3 list-disc ">
            <li>Access and correct your personal information</li>
            <li>Request deletion of your personal information</li>
            <li>
              Object to or restrict processing of your personal information
            </li>
            <li>Request data portability</li>
          </ul>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            Changes to This Privacy Policy
          </p>
          <ul className="list-inside pl-3 list-disc ">
            <li>
              We may update this privacy policy from time to time. We will
              notify you of significant changes by email or through our
              platform.
            </li>
          </ul>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            Compliance with Regulations
          </p>
          <p>We comply with the :</p>
          <ul className="list-inside pl-3 list-disc ">
            <li>Nigeria Data Protection Regulation (NDPR)</li>
            <li>General Data Protection Regulation (GDPR)</li>
          </ul>
        </div>
        <div>
          <p className="font-extrabold md:text-[24px] leading-[53px] text-[#000000]">
            Important Notes
          </p>
          <ul className="list-inside pl-3 list-disc ">
            <li>
              We do not collect personal information from anyone under the age
              of 18.
            </li>
            <li>
              We do not share your personal information with irrelevant third
              parties, nor do we sell it or abuse it in any way.
            </li>
          </ul>
        </div>
        <div className="md:mt-5">
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
