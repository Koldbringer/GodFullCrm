import type { Meta, StoryObj } from '@storybook/react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'; // Assuming recharts is used based on shadcn/ui

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from './chart'; // Assuming these are the exports from chart.tsx

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
};

const meta = {
  title: 'UI/Chart',
  component: ChartContainer, // Assuming ChartContainer is the main export
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full max-w-sm">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          // tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
      </BarChart>
    </ChartContainer>
  ),
  args: {},
};