import type { Meta, StoryObj } from '@storybook/react';
import { DataLoader } from './data-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const meta = {
  title: 'UI/DataLoader',
  component: DataLoader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof DataLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    isLoading: true,
    children: <div>This content will not be visible while loading</div>,
  },
};

export const CustomLoadingSkeleton: Story = {
  args: {
    isLoading: true,
    loadingSkeleton: (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    ),
    children: <div>This content will not be visible while loading</div>,
  },
};

export const Error: Story = {
  args: {
    error: 'Failed to load data. Please try again.',
    onRetry: () => alert('Retry clicked'),
    children: <div>This content will not be visible when there's an error</div>,
  },
};

export const Empty: Story = {
  args: {
    isEmpty: true,
    emptyMessage: 'No data available. Try changing your filters.',
    onRefresh: () => alert('Refresh clicked'),
    children: <div>This content will not be visible when empty</div>,
  },
};

export const Refreshing: Story = {
  args: {
    isRefreshing: true,
    children: (
      <Card>
        <CardHeader>
          <CardTitle>Data Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This content is visible but dimmed while refreshing</p>
          <p>You can see a loading spinner in the top-right corner</p>
        </CardContent>
      </Card>
    ),
  },
};

export const Loaded: Story = {
  args: {
    children: (
      <Card>
        <CardHeader>
          <CardTitle>Data Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the actual content when data is loaded successfully</p>
        </CardContent>
      </Card>
    ),
  },
};