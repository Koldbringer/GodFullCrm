import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './aspect-ratio';

const meta = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: 'number',
      defaultValue: 16 / 9,
    },
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[450px]">
      <AspectRatio ratio={args.ratio ?? 16 / 9} className="bg-muted">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Placeholder"
          className="rounded-md object-cover w-full h-full"
        />
      </AspectRatio>
    </div>
  ),
  args: {
    ratio: 16 / 9,
  },
};

export const Square: Story = {
  render: (args) => (
    <div className="w-[300px]">
      <AspectRatio ratio={args.ratio ?? 1 / 1} className="bg-muted">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Placeholder"
          className="rounded-md object-cover w-full h-full"
        />
      </AspectRatio>
    </div>
  ),
  args: {
    ratio: 1 / 1,
  },
};