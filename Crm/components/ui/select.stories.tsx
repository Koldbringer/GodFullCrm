import type { Meta, StoryObj } from '@storybook/react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
  subcomponents: {
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectItem,
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Wybierz owoc" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Owoce</SelectLabel>
          <SelectItem value="apple">Jabłko</SelectItem>
          <SelectItem value="banana">Banan</SelectItem>
          <SelectItem value="blueberry">Borówka</SelectItem>
          <SelectItem value="grapes">Winogrona</SelectItem>
          <SelectItem value="pineapple">Ananas</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  args: {},
};

export const Disabled: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Wybierz owoc" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Owoce</SelectLabel>
          <SelectItem value="apple">Jabłko</SelectItem>
          <SelectItem value="banana">Banan</SelectItem>
          <SelectItem value="blueberry">Borówka</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  args: {
    disabled: true,
  },
};

export const Scrollable: Story = {
    render: (args) => (
        <Select {...args}>
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Wybierz strefę czasową" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Ameryka Północna</SelectLabel>
                    <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                    <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                    <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                    <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                    <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                    <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel>Europa i Afryka</SelectLabel>
                    <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="cet">Central European Time (CET)</SelectItem>
                    <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                    <SelectItem value="west">Western European Summer Time (WEST)</SelectItem>
                    <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                    <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel>Azja</SelectLabel>
                    <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                    <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                    <SelectItem value="cst_asia">China Standard Time (CST)</SelectItem>
                    <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                    <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                    <SelectItem value="ist_indonesia">Indonesia Central Standard Time (WITA)</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
    args: {},
};