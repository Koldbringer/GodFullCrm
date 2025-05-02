"use client"

import React, { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CardAction } from "@/components/ui/card-action"
import { Badge } from "@/components/ui/badge"
import { Bell, ExternalLink, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function InteractiveCardExample() {
  const [cardClicks, setCardClicks] = useState(0)
  const [buttonClicks, setButtonClicks] = useState(0)
  const [dropdownClicks, setDropdownClicks] = useState(0)
  const [linkClicks, setLinkClicks] = useState(0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-4 border rounded-md">
          <p className="text-lg font-medium">Card Clicks</p>
          <p className="text-3xl font-bold">{cardClicks}</p>
        </div>
        <div className="p-4 border rounded-md">
          <p className="text-lg font-medium">Button Clicks</p>
          <p className="text-3xl font-bold">{buttonClicks}</p>
        </div>
        <div className="p-4 border rounded-md">
          <p className="text-lg font-medium">Dropdown Clicks</p>
          <p className="text-3xl font-bold">{dropdownClicks}</p>
        </div>
        <div className="p-4 border rounded-md">
          <p className="text-lg font-medium">Link Clicks</p>
          <p className="text-3xl font-bold">{linkClicks}</p>
        </div>
      </div>

      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setCardClicks(prev => prev + 1)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Interactive Card Example</CardTitle>
          
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setDropdownClicks(prev => prev + 1)}>
                  View details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDropdownClicks(prev => prev + 1)}>
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col space-y-4">
            <p>
              This card has an onClick handler that increments the "Card Clicks" counter.
              Click anywhere on the card to see it in action.
            </p>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="flex items-center gap-1">
                <Bell className="h-3 w-3" />
                <span>New notification</span>
              </Badge>
              
              <CardAction>
                <Button 
                  size="sm"
                  onClick={() => setButtonClicks(prev => prev + 1)}
                >
                  Take action
                </Button>
              </CardAction>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Updated 2 hours ago
          </p>
          
          <CardAction>
            <Button 
              variant="ghost" 
              size="sm"
              className="gap-1"
              onClick={() => setLinkClicks(prev => prev + 1)}
            >
              <span>View details</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
      
      <div className="text-sm text-muted-foreground">
        <p>
          Notice how clicking on the buttons, dropdown menu, and links doesn't trigger the card's onClick handler.
          This is because we're using the CardAction component to prevent event propagation.
        </p>
      </div>
    </div>
  )
}