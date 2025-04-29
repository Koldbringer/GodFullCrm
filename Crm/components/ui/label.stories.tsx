import type { Meta, StoryObj } from '@storybook/react';

import { Label } from './label';
import { Input } from './input'; // Import Input for context

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    htmlFor: { control: 'text' },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Twoja etykieta',
    htmlFor: 'email-input',
  },
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label {...args} />
      <Input type="email" id="email-input" placeholder="Email" />
    </div>
  ),
};