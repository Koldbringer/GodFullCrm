import type { Meta, StoryObj } from '@storybook/react';

import { Separator } from './separator';

const meta = {
  title: 'UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    decorative: { control: 'boolean' },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-full max-w-sm">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          Dostępne komponenty UI.
        </p>
      </div>
      <Separator className="my-4" {...args} />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Dokumentacja</div>
        <Separator orientation="vertical" />
        <div>Źródło</div>
      </div>
    </div>
  ),
  args: {
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  render: (args) => (
    <div className="flex h-40 items-center space-x-4">
      <div>Blog</div>
      <Separator orientation="vertical" {...args} />
      <div>Dokumentacja</div>
      <Separator orientation="vertical" {...args} />
      <div>Źródło</div>
    </div>
  ),
  args: {
    orientation: 'vertical',
  },
};