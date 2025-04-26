import type { Meta, StoryObj } from '@storybook/react';

import { Input } from './input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
    },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Wpisz tekst...',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Hasło',
  },
};

export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: 'Nieaktywne pole',
    disabled: true,
  },
};