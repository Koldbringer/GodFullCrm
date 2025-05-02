import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './logo';
import { I18nProvider } from '@/components/i18n/i18n-provider';

const meta = {
  title: 'UI/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showText: { control: 'boolean' },
    linkToHome: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'sidebar', 'footer'],
    },
  },
  decorators: [
    (Story) => (
      <I18nProvider>
        <div className="p-4">
          <Story />
        </div>
      </I18nProvider>
    ),
  ],
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showText: true,
    linkToHome: true,
    size: 'md',
    variant: 'default',
  },
};

export const IconOnly: Story = {
  args: {
    showText: false,
    linkToHome: true,
    size: 'md',
    variant: 'default',
  },
};

export const Large: Story = {
  args: {
    showText: true,
    linkToHome: true,
    size: 'lg',
    variant: 'default',
  },
};

export const Small: Story = {
  args: {
    showText: true,
    linkToHome: true,
    size: 'sm',
    variant: 'default',
  },
};

export const SidebarVariant: Story = {
  args: {
    showText: true,
    linkToHome: true,
    size: 'md',
    variant: 'sidebar',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const FooterVariant: Story = {
  args: {
    showText: true,
    linkToHome: true,
    size: 'sm',
    variant: 'footer',
  },
};
