# Core Components Documentation

This document outlines the core components that should be used across the HVAC CRM/ERP system to ensure a cohesive user experience.

## CardAction

The `CardAction` component prevents event propagation for interactive elements inside cards. This is useful when you have buttons or other interactive elements inside a card that has its own onClick handler.

### Usage

```tsx
import { CardAction } from "@/components/ui/card-action";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InteractiveCard() {
  return (
    <Card 
      className="cursor-pointer" 
      onClick={() => console.log("Card clicked")}
    >
      <CardContent>
        <p>Card content</p>
        
        {/* Without CardAction, clicking this button would also trigger the card's onClick */}
        <CardAction>
          <Button onClick={() => console.log("Button clicked")}>
            Click me
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  );
}
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | The interactive elements to prevent event propagation for |
| `className` | `string` | Additional CSS classes |
| `onClick` | `(e: React.MouseEvent) => void` | Optional click handler |

## PageHeader

The `PageHeader` component provides a consistent header for all pages in the application. It includes support for breadcrumbs, icons, and actions.

### Usage

```tsx
import { PageHeader } from "@/components/ui/page-header/page-header";
import { LayoutDashboard, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyPage() {
  return (
    <PageHeader
      icon={LayoutDashboard}
      title="Page Title"
      description="Page description goes here"
      breadcrumbs={[
        { href: "/dashboard", label: "Dashboard" },
        { href: "/current-page", label: "Current Page" }
      ]}
      actions={
        <>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button asChild>
            <Link href="/new-item">
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Link>
          </Button>
        </>
      }
    />
  );
}
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | The title of the page |
| `description` | `string` | (Optional) A description of the page |
| `icon` | `LucideIcon` | (Optional) An icon to display next to the title |
| `breadcrumbs` | `{ href: string, label: string }[]` | (Optional) An array of breadcrumb items |
| `actions` | `React.ReactNode` | (Optional) Actions to display on the right side of the header |

## DataLoader

The `DataLoader` component provides a consistent way to handle loading, error, and empty states for data-driven components.

### Usage

```tsx
import { DataLoader } from "@/components/ui/data-loader";
import { useState, useEffect } from "react";

export default function MyDataComponent() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/data");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataLoader
      isLoading={isLoading}
      error={error}
      onRetry={() => fetchData()}
      isEmpty={data.length === 0}
      emptyMessage="No data found"
    >
      {/* Your data display component here */}
      <div>
        {data.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </DataLoader>
  );
}
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `isLoading` | `boolean` | Whether the data is currently loading |
| `isRefreshing` | `boolean` | Whether the data is being refreshed (different visual state than initial loading) |
| `error` | `string \| null` | Error message to display if there was an error loading the data |
| `onRetry` | `() => void` | Function to retry loading the data if there was an error |
| `onRefresh` | `() => void` | Function to refresh the data |
| `isEmpty` | `boolean` | Whether there is data to display |
| `emptyMessage` | `string` | Message to display if there is no data |
| `emptyContent` | `React.ReactNode` | Content to display when there is no data |
| `children` | `React.ReactNode` | Content to display when data is loaded successfully |
| `loadingSkeleton` | `React.ReactNode` | Custom loading skeleton to display |

## Best Practices

### Page Structure

All pages should follow this structure:

```tsx
export default function MyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with navigation */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <NotificationCenter />
            <UserNav />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Page header */}
        <PageHeader
          icon={Icon}
          title="Page Title"
          description="Page description"
          breadcrumbs={[...]}
          actions={...}
        />
        
        {/* Page content */}
        <DataLoader
          isLoading={isLoading}
          error={error}
          onRetry={fetchData}
          isEmpty={data.length === 0}
          emptyMessage="No data found"
        >
          {/* Your data display component here */}
        </DataLoader>
      </div>
    </div>
  );
}
```

### Loading States

- Use the `DataLoader` component for all data-driven components
- Provide custom loading skeletons that match the structure of your data
- Use the `isRefreshing` prop for subsequent data loads after the initial load

### Error Handling

- Always provide an `onRetry` function when using the `DataLoader` component
- Use descriptive error messages that help the user understand what went wrong
- Log errors to the console for debugging purposes

### Empty States

- Provide helpful empty messages that guide the user on what to do next
- Consider providing actions in the empty state, such as "Add New" or "Refresh"

## Example Implementation

See the `app/dashboard/page-with-core-components.tsx` file for an example implementation of these core components.