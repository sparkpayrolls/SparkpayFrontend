import React from 'react';
import { NextPage } from 'next';

import { Button } from '../../src/components/Button/Button';

const EmailTemplate: NextPage = () => {
  return (
    <div className="email-template">
      <div className="email-template__welcome-section">
        <p className="email-template__welcome-subtext">Hi Kingsley,</p>
        <h1 className="email-template__welcome-title">Welcome to Sparkpay</h1>
        <div>
          <p className="email-template__body-of-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam quis
            proin lobortis aliquet venenatis urna, senectus arcu ultrices.
            Volutpat, tempor mattis posuere tempor felis. Pulvinar dignissim
            nisi, sed sit in. Consequat enim risus sollicitudin, habitasse
            tortor habitant porttitor sagittis viverra dolor quis.
          </p>
          <p className="email-template__">Cheers, From Sparkpay Team</p>
        </div>
        <Button
          label="Get Started"
          onClick={() => {}}
          className="email-template__get-started-btn"
          type="button"
          primary
        />
        <div>
          <p>
            © 2021 Sparkpay. All rights reserved. You are receiving this message
            because you signed up on Sparkpay.{' '}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;
