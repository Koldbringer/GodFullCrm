import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './page-header';
import { Button } from '@/components/ui/button';
import { Plus, Filter, LayoutDashboard } from 'lucide-react';

const meta = {
  title: 'UI/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Page Title',
    description: 'This is a description of the page',
    icon: LayoutDashboard,
  },
};

export const WithActions: Story = {
  args: {
    title: 'Page Title',
    description: 'This is a description of the page',
    icon: LayoutDashboard,
    actions: (
      <>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </>
    ),
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    title: 'Page Title',
    description: 'This is a description of the page',
    icon: LayoutDashboard,
    breadcrumbs: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/customers', label: 'Customers' },
      { href: '/customers/details', label: 'Details' },
    ],
  },
};

export const Complete: Story = {
  args: {
    title: 'Page Title',
    description: 'This is a description of the page',
    icon: LayoutDashboard,
    breadcrumbs: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/customers', label: 'Customers' },
      { href: '/customers/details', label: 'Details' },
    ],
    actions: (
      <>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </>
    ),
  },
};