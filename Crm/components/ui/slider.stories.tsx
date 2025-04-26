import type { Meta, StoryObj } from '@storybook/react';
import { cn } from '@/lib/utils'; // Assuming utils path

import { Slider } from './slider';

type SliderProps = React.ComponentProps<typeof Slider>

const meta = {
  title: 'UI/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: { control: 'object' }, // Array of numbers
    value: { control: 'object' }, // Array of numbers
    max: { control: 'number' },
    min: { control: 'number' },
    step: { control: 'number' },
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    disabled: { control: 'boolean' },
    inverted: { control: 'boolean' },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Slider
      defaultValue={[50]}
      max={100}
      step={1}
      className={cn('w-[60%]', args.className)}
      {...args}
    />
  ),
  args: {},
};

export const Range: Story = {
  render: (args) => (
    <Slider
      defaultValue={[25, 75]}
      max={100}
      step={1}
      className={cn('w-[60%]', args.className)}
      {...args}
    />
  ),
  args: {},
};

export const Vertical: Story = {
  render: (args) => (
    <Slider
      defaultValue={[50]}
      max={100}
      step={1}
      orientation="vertical"
      className={cn('h-[200px]', args.className)} // Added height for vertical
      {...args}
    />
  ),
  args: {
    orientation: 'vertical',
  },
};

export const Disabled: Story = {
  render: (args) => (
    <Slider
      defaultValue={[50]}
      max={100}
      step={1}
      disabled
      className={cn('w-[60%]', args.className)}
      {...args}
    />
  ),
  args: {
    disabled: true,
  },
};