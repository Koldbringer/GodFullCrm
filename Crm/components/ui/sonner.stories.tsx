import type { Meta, StoryObj } from '@storybook/react';
import { toast } from 'sonner';

import { Button } from './button';
import { Toaster } from './sonner'; // Assuming sonner.tsx exports Toaster

const meta = {
  title: 'UI/Sonner (Toaster)',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
    },
    richColors: { control: 'boolean' },
    closeButton: { control: 'boolean' },
    // Add other relevant props from sonner
  },
  decorators: [
    (Story, { args }) => (
      <div>
        <Story />
        {/* Render Toaster with props for the story */}
        <Toaster {...args} />
      </div>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base story showing button triggers
const BaseSonnerStory: Story = {
  render: (args) => (
    <div className="flex flex-col space-y-2">
      <Button
        variant="outline"
        onClick={() => toast('Zdarzenie zostało utworzone')}
      >
        Pokaż domyślny toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.success('Sukces!', {
            description: 'Zdarzenie zostało pomyślnie utworzone.',
            action: {
              label: 'Cofnij',
              onClick: () => console.log('Cofnięto'),
            },
          })
        }
      >
        Pokaż toast sukcesu
      </Button>
       <Button
        variant="outline"
        onClick={() =>
          toast.error('Błąd!', {
            description: 'Nie udało się utworzyć zdarzenia.',
            action: {
              label: 'Spróbuj ponownie',
              onClick: () => console.log('Spróbuj ponownie'),
            },
          })
        }
      >
        Pokaż toast błędu
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.info('Informacja', {
            description: 'To jest tylko informacja.',
          })
        }
      >
        Pokaż toast informacyjny
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning('Ostrzeżenie', {
            description: 'Uważaj na tę akcję.',
          })
        }
      >
        Pokaż toast ostrzegawczy
      </Button>
    </div>
  ),
  args: {
    // Default args for Toaster itself
    position: 'bottom-right',
    richColors: false,
    closeButton: false,
  },
};

export const Default = { ...BaseSonnerStory };

export const RichColors: Story = {
    ...BaseSonnerStory,
    args: {
        ...BaseSonnerStory.args,
        richColors: true,
    },
};

export const WithCloseButton: Story = {
    ...BaseSonnerStory,
    args: {
        ...BaseSonnerStory.args,
        closeButton: true,
    },
};

export const TopCenter: Story = {
    ...BaseSonnerStory,
    args: {
        ...BaseSonnerStory.args,
        position: 'top-center',
    },
};