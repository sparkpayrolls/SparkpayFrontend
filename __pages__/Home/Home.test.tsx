import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import Home from '../../pages/Home';

configure({ adapter: new Adapter() });
const app = shallow(<Home />);

it('renders correctly', () => {
  expect(app).toMatchSnapshot();
});
