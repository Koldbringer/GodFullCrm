import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { Label } from './label'; // Often used with Checkbox

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' }, // Or 'indeterminate'
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" {...args} />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
  args: {},
};

export const Disabled: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms-disabled" {...args} />
      <Label htmlFor="terms-disabled">Accept terms and conditions</Label>
    </div>
  ),
  args: {
    disabled: true,
  },
};

export const Checked: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms-checked" {...args} />
      <Label htmlFor="terms-checked">Accept terms and conditions</Label>
    </div>
  ),
  args: {
    checked: true,
  },
};

// Example for indeterminate state if supported by your component
// export const Indeterminate: Story = {
//   render: (args) => (
//     <div className="flex items-center space-x-2">
//       <Checkbox id="terms-indeterminate" {...args} />
//       <Label htmlFor="terms-indeterminate">Accept terms and conditions</Label>
//     </div>
//   ),
//   args: {
//     checked: 'indeterminate',
//   },
// };