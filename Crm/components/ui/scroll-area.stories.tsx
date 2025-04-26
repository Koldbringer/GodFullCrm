import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { ScrollArea } from './scroll-area';
import { Separator } from './separator'; // Assuming separator is used in example

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

const meta = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ScrollArea className="h-72 w-48 rounded-md border" {...args}>
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tagi</h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  ),
  args: {},
};

export const HorizontalDemo: Story = {
    render: (args) => (
        <ScrollArea className="w-96 whitespace-nowrap rounded-md border" {...args}>
            <div className="flex w-max space-x-4 p-4">
                {Array.from({ length: 10 }).map((_, i) => (
                    <figure key={i} className="shrink-0">
                        <div className="overflow-hidden rounded-md">
                            {/* Placeholder for an image or content */}
                            <div className="h-[150px] w-[150px] bg-secondary flex items-center justify-center">
                                <span className="text-muted-foreground">Obrazek {i + 1}</span>
                            </div>
                        </div>
                        <figcaption className="pt-2 text-xs text-muted-foreground">
                            Zdjęcie autorstwa{' '}
                            <span className="font-semibold text-foreground">
                                Artyści {i + 1}
                            </span>
                        </figcaption>
                    </figure>
                ))}
            </div>
            {/* ScrollBar orientation="horizontal" /> */}
            {/* Horizontal ScrollBar might be implicitly handled or added via className */}
        </ScrollArea>
    ),
    args: {},
};