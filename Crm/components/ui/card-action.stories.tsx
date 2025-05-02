import type { Meta, StoryObj } from '@storybook/react';
import { CardAction } from './card-action';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { useState } from 'react';

const meta = {
  title: 'UI/CardAction',
  component: CardAction,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof CardAction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [cardClicks, setCardClicks] = useState(0);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [buttonClicks, setButtonClicks] = useState(0);

    return (
      <div className="space-y-4">
        <div className="text-center space-y-2 mb-4">
          <p>Card clicks: {cardClicks}</p>
          <p>Button clicks: {buttonClicks}</p>
        </div>
        
        <Card 
          className="w-[350px] cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setCardClicks(prev => prev + 1)}
        >
          <CardHeader>
            <CardTitle>Interactive Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This card has an onClick handler. Without CardAction, clicking the button would also trigger the card's onClick.</p>
            
            <CardAction {...args}>
              <Button 
                onClick={() => setButtonClicks(prev => prev + 1)}
              >
                Click me (stops propagation)
              </Button>
            </CardAction>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">Click anywhere on the card</p>
            
            <Button 
              variant="ghost" 
              onClick={(e) => {
                // Without CardAction, we need to manually stop propagation
                e.stopPropagation();
                setButtonClicks(prev => prev + 1);
              }}
            >
              Manual stop
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  },
  args: {},
};