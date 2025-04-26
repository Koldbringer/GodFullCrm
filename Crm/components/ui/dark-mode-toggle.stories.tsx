import type { Meta, StoryObj } from '@storybook/react';
import { DarkModeToggle } from './dark-mode-toggle';

const meta = {
  title: 'UI/DarkModeToggle',
  component: DarkModeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof DarkModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <DarkModeToggle {...args} />,
  args: {},
};