import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
  subcomponents: {
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const SheetSideTemplate: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button variant="outline">Otwórz {args.side}</Button>
      </SheetTrigger>
      <SheetContent side={args.side}>
        <SheetHeader>
          <SheetTitle>Edytuj profil</SheetTitle>
          <SheetDescription>
            Wprowadź zmiany w swoim profilu tutaj. Kliknij zapisz, gdy skończysz.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nazwa
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Nazwa użytkownika
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Zapisz zmiany</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Right: Story = {
  ...SheetSideTemplate,
  args: {
    side: 'right',
  },
};

export const Left: Story = {
    ...SheetSideTemplate,
    args: {
        side: 'left',
    },
};

export const Top: Story = {
    ...SheetSideTemplate,
    args: {
        side: 'top',
    },
};

export const Bottom: Story = {
    ...SheetSideTemplate,
    args: {
        side: 'bottom',
    },
};