import type { Meta, StoryObj } from '@storybook/react';
import { SkipLink } from './skip-link';
import { A11yProvider } from '@/components/a11y/a11y-context';

const meta = {
  title: 'Atoms/SkipLink',
  component: SkipLink,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    targetId: { control: 'text' },
    announce: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <A11yProvider>
        <div className="min-h-[300px] flex flex-col items-center justify-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Tab into this component to see the skip link appear. Press Enter to activate it.
          </p>
          <Story />
          <div id="main-content" className="mt-8 p-4 border rounded-md">
            <h2 className="text-lg font-medium">Main Content</h2>
            <p>This is the main content area that the skip link targets.</p>
          </div>
        </div>
      </A11yProvider>
    ),
  ],
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    targetId: 'main-content',
  },
};

export const CustomLabel: Story = {
  args: {
    targetId: 'main-content',
    label: 'Skip to main content',
  },
};

export const WithAnnouncement: Story = {
  args: {
    targetId: 'main-content',
    announce: true,
  },
};
