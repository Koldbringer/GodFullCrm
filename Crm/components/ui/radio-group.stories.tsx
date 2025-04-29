import type { Meta, StoryObj } from '@storybook/react';

import { Label } from './label';
import { RadioGroup, RadioGroupItem } from './radio-group';

const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: { control: 'text' },
    disabled: { control: 'boolean' },
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
  },
  subcomponents: { RadioGroupItem },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup defaultValue="comfortable" {...args}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Domyślny</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Komfortowy</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Kompaktowy</Label>
      </div>
    </RadioGroup>
  ),
  args: {
    defaultValue: 'comfortable',
  },
};

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup defaultValue="comfortable" {...args}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1d" />
        <Label htmlFor="r1d">Domyślny</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2d" />
        <Label htmlFor="r2d">Komfortowy</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3d" />
        <Label htmlFor="r3d">Kompaktowy</Label>
      </div>
    </RadioGroup>
  ),
  args: {
    defaultValue: 'comfortable',
    disabled: true,
  },
};

export const Horizontal: Story = {
  render: (args) => (
    <RadioGroup defaultValue="comfortable" {...args}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1h" />
        <Label htmlFor="r1h">Domyślny</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2h" />
        <Label htmlFor="r2h">Komfortowy</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3h" />
        <Label htmlFor="r3h">Kompaktowy</Label>
      </div>
    </RadioGroup>
  ),
  args: {
    defaultValue: 'comfortable',
    orientation: 'horizontal',
  },
};