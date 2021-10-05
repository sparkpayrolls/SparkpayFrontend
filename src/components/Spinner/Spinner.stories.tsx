import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Spinner } from './Spinner';

export default {
  title: 'Spinner',
  component: Spinner,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Spinner>;

const Template: ComponentStory<typeof Spinner> = (args) => (
  <Spinner {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  color: '#fff',
};
