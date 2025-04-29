import type { Meta, StoryObj } from '@storybook/react';

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from './menubar';

const meta = {
  title: 'UI/Menubar',
  component: Menubar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  subcomponents: {
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarCheckboxItem,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSub,
    MenubarSubTrigger,
    MenubarSubContent,
  },
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Menubar {...args}>
      <MenubarMenu>
        <MenubarTrigger>Plik</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Nowa karta <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Nowe okno</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Udostępnij</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Drukuj</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edycja</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Cofnij <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Ponów <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Znajdź</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Szukaj w sieci</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Znajdź...</MenubarItem>
              <MenubarItem>Znajdź następny</MenubarItem>
              <MenubarItem>Znajdź poprzedni</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Wytnij</MenubarItem>
          <MenubarItem>Kopiuj</MenubarItem>
          <MenubarItem>Wklej</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Widok</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Zawsze pokazuj pasek zakładek</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>
            Zawsze pokazuj pełne adresy URL
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Odśwież <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            Wymuś odświeżenie <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Przełącz pełny ekran</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Ukryj pasek boczny</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profile</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="benoit">
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Edytuj...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Dodaj profil...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  args: {},
};