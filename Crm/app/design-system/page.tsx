"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ColorSystem } from "@/components/ui/color-system"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { ResponsiveContainer } from "@/components/responsive/responsive-container"

export default function DesignSystemPage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Design System</h1>
        <p className="text-muted-foreground">
          A comprehensive guide to the design system used in the HVAC CRM ERP application.
        </p>
      </div>

      <Tabs defaultValue="colors">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="mt-6">
          <ColorSystem />
        </TabsContent>
        
        <TabsContent value="typography" className="mt-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                The typography system used throughout the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Heading 1</h2>
                <h2 className="text-2xl font-bold">Heading 2</h2>
                <h3 className="text-xl font-bold">Heading 3</h3>
                <h4 className="text-lg font-medium">Heading 4</h4>
                <h5 className="text-base font-medium">Heading 5</h5>
                <h6 className="text-sm font-medium">Heading 6</h6>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <p className="text-lg">Large paragraph text for important information.</p>
                <p>Default paragraph text for general content.</p>
                <p className="text-sm">Small text for less important information.</p>
                <p className="text-xs">Extra small text for captions and footnotes.</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="font-bold">Bold text</p>
                <p className="font-medium">Medium text</p>
                <p className="font-normal">Normal text</p>
                <p className="italic">Italic text</p>
                <p className="underline">Underlined text</p>
                <p className="text-muted-foreground">Muted text</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="components" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>
                  Button components with different variants and sizes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><InfoIcon className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Form Inputs</CardTitle>
                <CardDescription>
                  Various form input components.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Enter your email" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Type your message here" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>
                
                <div className="grid gap-2">
                  <Label>Select option</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Choose one</Label>
                  <RadioGroup defaultValue="option1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option1" id="option1" />
                      <Label htmlFor="option1">Option 1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option2" id="option2" />
                      <Label htmlFor="option2">Option 2</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="grid gap-2">
                  <Label>Slider</Label>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Display</CardTitle>
                <CardDescription>
                  Components for displaying data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </div>
                
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    This is an informational alert message.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Layout Components</CardTitle>
                <CardDescription>
                  Components for structuring layout.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Responsive Container</p>
                  <ResponsiveContainer 
                    maxWidth="full" 
                    padding="sm" 
                    paddingY="sm" 
                    bordered 
                    rounded
                    className="bg-muted/30"
                  >
                    <p className="text-center text-sm">Responsive Container</p>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Separator</p>
                  <Separator />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Card</p>
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>Card description</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Card content</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="patterns" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Design Principles</CardTitle>
                <CardDescription>
                  Core principles guiding the design system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Minimalism</h3>
                  <p className="text-sm text-muted-foreground">
                    Focus on essential elements, remove clutter, and prioritize content.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Consistency</h3>
                  <p className="text-sm text-muted-foreground">
                    Maintain consistent patterns, components, and interactions throughout the application.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Accessibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensure the application is usable by people with diverse abilities.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Responsiveness</h3>
                  <p className="text-sm text-muted-foreground">
                    Design for all screen sizes and devices.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Usage Guidelines</CardTitle>
                <CardDescription>
                  How to use the design system effectively.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Component Selection</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose the appropriate component for the task. Don't reinvent existing components.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Spacing</h3>
                  <p className="text-sm text-muted-foreground">
                    Use consistent spacing throughout the application. Follow the 4px/8px grid system.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Typography</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the defined type scale. Don't introduce new font sizes or families.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Color Usage</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the defined color palette. Ensure sufficient contrast for accessibility.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
