import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedCard } from './enhanced-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Bell, 
  Calendar, 
  CreditCard, 
  Settings, 
  User, 
  Users 
} from 'lucide-react';

const meta = {
  title: 'Molecules/Card/EnhancedCard',
  component: EnhancedCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    hover: {
      control: 'select',
      options: ['none', 'lift', 'glow', 'border'],
    },
    interactive: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    showHeader: {
      control: 'boolean',
    },
    showFooter: {
      control: 'boolean',
    },
    contentSpacing: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    footerAlign: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
  },
} satisfies Meta<typeof EnhancedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    description: 'Card description goes here',
    className: 'w-[350px]',
    children: (
      <p>This is the card content. You can put anything here.</p>
    ),
  },
};

export const WithIcon: Story = {
  args: {
    title: 'User Profile',
    description: 'View and edit your profile information',
    icon: User,
    className: 'w-[350px]',
    children: (
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Email</p>
          <p className="text-sm text-muted-foreground">john.doe@example.com</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Role</p>
          <p className="text-sm text-muted-foreground">Administrator</p>
        </div>
      </div>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Payment Method',
    description: 'Manage your payment methods',
    icon: CreditCard,
    showFooter: true,
    footer: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </>
    ),
    className: 'w-[350px]',
    children: (
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Card Number</p>
          <p className="text-sm text-muted-foreground">**** **** **** 4242</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Expiry Date</p>
          <p className="text-sm text-muted-foreground">12/2025</p>
        </div>
      </div>
    ),
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading Data',
    description: 'Please wait while we load your data',
    isLoading: true,
    className: 'w-[350px]',
    children: null,
  },
};

export const Interactive: Story = {
  args: {
    title: 'Interactive Card',
    description: 'Click me to perform an action',
    icon: Bell,
    interactive: true,
    hover: 'lift',
    className: 'w-[350px]',
    onClick: () => alert('Card clicked!'),
    children: (
      <p>This card is interactive. Click anywhere on the card to trigger an action.</p>
    ),
  },
};

export const Primary: Story = {
  args: {
    title: 'Primary Card',
    description: 'This is a primary card with custom styling',
    variant: 'primary',
    className: 'w-[350px]',
    children: (
      <p>This card uses the primary color scheme.</p>
    ),
  },
};

export const WithContentSpacing: Story = {
  args: {
    title: 'Team Members',
    description: 'Manage your team members and their access',
    icon: Users,
    contentSpacing: 'md',
    className: 'w-[350px]',
    children: (
      <>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
          <Badge>Active</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Jane Smith</p>
              <p className="text-xs text-muted-foreground">Editor</p>
            </div>
          </div>
          <Badge>Active</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Mike Johnson</p>
              <p className="text-xs text-muted-foreground">Viewer</p>
            </div>
          </div>
          <Badge variant="outline">Invited</Badge>
        </div>
      </>
    ),
  },
};

export const Dashboard: Story = {
  args: {
    title: 'Monthly Revenue',
    description: 'Revenue for the current month',
    icon: BarChart3,
    hover: 'glow',
    className: 'w-[350px]',
    children: (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">$24,780</p>
          <Badge variant="outline" className="text-green-500">+12.5%</Badge>
        </div>
        <div className="h-[100px] bg-muted/30 rounded-md flex items-end justify-between px-2">
          {[40, 70, 45, 90, 60, 80, 75].map((height, i) => (
            <div 
              key={i} 
              className="w-6 bg-primary/80 rounded-t-sm" 
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">Last 7 days</p>
      </div>
    ),
  },
};

export const Calendar: Story = {
  args: {
    title: 'Upcoming Events',
    description: 'Your schedule for the next few days',
    icon: Calendar,
    variant: 'outline',
    contentSpacing: 'md',
    className: 'w-[350px]',
    children: (
      <>
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary">
            <span className="text-xs font-medium">MAR</span>
            <span className="text-sm font-bold">15</span>
          </div>
          <div>
            <p className="text-sm font-medium">Client Meeting</p>
            <p className="text-xs text-muted-foreground">10:00 AM - 11:30 AM</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary">
            <span className="text-xs font-medium">MAR</span>
            <span className="text-sm font-bold">16</span>
          </div>
          <div>
            <p className="text-sm font-medium">Team Standup</p>
            <p className="text-xs text-muted-foreground">9:00 AM - 9:30 AM</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary">
            <span className="text-xs font-medium">MAR</span>
            <span className="text-sm font-bold">18</span>
          </div>
          <div>
            <p className="text-sm font-medium">Project Review</p>
            <p className="text-xs text-muted-foreground">2:00 PM - 3:00 PM</p>
          </div>
        </div>
      </>
    ),
  },
};

export const Settings: Story = {
  args: {
    title: 'Settings',
    description: 'Manage your account settings and preferences',
    icon: Settings,
    variant: 'secondary',
    contentSpacing: 'md',
    showFooter: true,
    footerAlign: 'end',
    footer: (
      <Button variant="default" size="sm">Save Changes</Button>
    ),
    className: 'w-[350px]',
    children: (
      <>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Notifications</p>
            <p className="text-xs text-muted-foreground">Receive email notifications</p>
          </div>
          <div className="h-4 w-8 bg-primary rounded-full relative">
            <div className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-white" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Two-Factor Authentication</p>
            <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
          </div>
          <div className="h-4 w-8 bg-muted rounded-full relative">
            <div className="absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">API Access</p>
            <p className="text-xs text-muted-foreground">Allow API access to your account</p>
          </div>
          <div className="h-4 w-8 bg-primary rounded-full relative">
            <div className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-white" />
          </div>
        </div>
      </>
    ),
  },
};
