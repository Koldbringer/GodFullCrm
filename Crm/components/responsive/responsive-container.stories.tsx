import type { Meta, StoryObj } from '@storybook/react';
import { ResponsiveContainer } from './responsive-container';

const meta = {
  title: 'Layout/ResponsiveContainer',
  component: ResponsiveContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    maxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full', 'none'],
      defaultValue: 'xl',
    },
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
    },
    paddingY: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'none',
    },
    centered: {
      control: 'boolean',
      defaultValue: true,
    },
    bordered: {
      control: 'boolean',
      defaultValue: false,
    },
    shadowed: {
      control: 'boolean',
      defaultValue: false,
    },
    rounded: {
      control: 'boolean',
      defaultValue: false,
    },
  },
} satisfies Meta<typeof ResponsiveContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ResponsiveContainer {...args}>
      <div className="bg-muted p-4 text-center">
        <p>Responsive Container Content</p>
        <p className="text-muted-foreground text-sm">Resize the window to see responsiveness</p>
      </div>
    </ResponsiveContainer>
  ),
  args: {
    maxWidth: 'xl',
    padding: 'md',
    paddingY: 'none',
    centered: true,
    bordered: false,
    shadowed: false,
    rounded: false,
  },
};

export const WithBorder: Story = {
  render: (args) => (
    <ResponsiveContainer {...args}>
      <div className="bg-muted p-4 text-center">
        <p>Responsive Container with Border</p>
      </div>
    </ResponsiveContainer>
  ),
  args: {
    maxWidth: 'lg',
    padding: 'md',
    paddingY: 'md',
    centered: true,
    bordered: true,
    shadowed: false,
    rounded: true,
  },
};

export const WithShadow: Story = {
  render: (args) => (
    <ResponsiveContainer {...args}>
      <div className="bg-muted p-4 text-center">
        <p>Responsive Container with Shadow</p>
      </div>
    </ResponsiveContainer>
  ),
  args: {
    maxWidth: 'md',
    padding: 'md',
    paddingY: 'md',
    centered: true,
    bordered: false,
    shadowed: true,
    rounded: true,
  },
};

export const Card: Story = {
  render: (args) => (
    <ResponsiveContainer {...args}>
      <div className="p-4 text-center">
        <h3 className="text-lg font-medium mb-2">Card Title</h3>
        <p className="text-muted-foreground">This is a card-like container with border, shadow, and rounded corners.</p>
      </div>
    </ResponsiveContainer>
  ),
  args: {
    maxWidth: 'sm',
    padding: 'lg',
    paddingY: 'md',
    centered: true,
    bordered: true,
    shadowed: true,
    rounded: true,
  },
};
