import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import ResetPassword from '../../pages/reset-password';

configure({ adapter: new Adapter() });
const app = shallow(<ResetPassword />);

it('renders correctly', () => {
  expect(app).toMatchSnapshot();
});
