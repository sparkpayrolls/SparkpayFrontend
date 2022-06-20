import { Button } from '@/components/Button/Button.component';
import { NextPage } from 'next';
import Image from 'next/image';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import checkMarkCircle from '../../public/svgs/check_mark_circle.svg';

const RequestReceived: NextPage = () => {
  return (
    <DashboardLayoutV2 title="Request Received">
      <div className="request-received">
        <div>
          <div className="success-message">
            <div className="success-message__illustration">
              <Image src={checkMarkCircle} alt="check-mark" />

              <p className="success-message__illustration-message">
                Successful
              </p>
            </div>

            <p className="success-message__message">
              Your request for access was successful
            </p>

            <Button
              type="button"
              className="success-message__button"
              label={'Continue to Login'}
              element="a"
              href="/login"
              primary
            />
          </div>
        </div>
      </div>
    </DashboardLayoutV2>
  );
};
export default RequestReceived;
