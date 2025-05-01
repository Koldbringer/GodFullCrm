import type { Meta, StoryObj } from '@storybook/react';
import { ColorSystem, ColorGroup, ColorSwatch } from './color-system';
import { ThemeProvider } from '@/components/theme-provider';

const meta = {
  title: 'UI/ColorSystem',
  component: ColorSystem,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <div className="container mx-auto py-10">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ColorSystem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ColorGroupExample: Story = {
  render: () => (
    <ColorGroup
      title="Primary Colors"
      colors={[
        { name: "Primary", variable: "primary" },
        { name: "Primary Foreground", variable: "primary-foreground" },
        { name: "Secondary", variable: "secondary" },
        { name: "Secondary Foreground", variable: "secondary-foreground" },
      ]}
    />
  ),
};

export const ColorSwatchExample: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ColorSwatch name="Primary" variable="primary" />
      <ColorSwatch name="Secondary" variable="secondary" />
      <ColorSwatch name="Accent" variable="accent" />
      <ColorSwatch name="Destructive" variable="destructive" />
    </div>
  ),
};
