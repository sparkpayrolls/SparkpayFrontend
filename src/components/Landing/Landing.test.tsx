import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { Landing } from './Landing.component';

configure({ adapter: new Adapter() });
const app = shallow(<Landing />);

it('renders correctly', () => {
  expect(app).toMatchSnapshot();
});
