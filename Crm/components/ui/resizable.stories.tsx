import type { Meta, StoryObj } from '@storybook/react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './resizable';

const meta = {
  title: 'UI/Resizable',
  component: ResizablePanelGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'radio', options: ['horizontal', 'vertical'] },
  },
  subcomponents: { ResizablePanel, ResizableHandle },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <ResizablePanelGroup
      className="max-w-md rounded-lg border"
      style={{ height: '200px' }} // Added fixed height for visibility
      {...args}
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Jeden</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Dwa</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Trzy</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  args: {
    direction: 'horizontal',
  },
};

export const Vertical: Story = {
  render: (args) => (
    <ResizablePanelGroup
      direction="vertical"
      className="min-h-[200px] w-full max-w-md rounded-lg border"
      {...args}
    >
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Nagłówek</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Treść</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  args: {
    direction: 'vertical',
  },
};

export const WithHandle: Story = {
    render: (args) => (
      <ResizablePanelGroup
        className="max-w-md rounded-lg border"
        style={{ height: '200px' }} // Added fixed height for visibility
        {...args}
      >
        <ResizablePanel defaultSize={25}>
          <div className="flex h-[200px] items-center justify-center p-6">
            <span className="font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
    args: {
      direction: 'horizontal',
    },
  };