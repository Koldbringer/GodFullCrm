import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { Progress } from './progress';

const meta = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'number' },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [progress, setProgress] = React.useState(13);

    React.useEffect(() => {
      const timer = setTimeout(() => setProgress(66), 500);
      return () => clearTimeout(timer);
    }, []);

    return <Progress value={progress} className="w-[60%]" {...args} />;
  },
  args: {},
};

export const Indeterminate: Story = {
    render: (args) => (
        <Progress className="w-[60%]" {...args} />
    ),
    args: {},
};

export const SpecificValue: Story = {
  args: {
    value: 75,
    className: 'w-[60%]',
  },
};