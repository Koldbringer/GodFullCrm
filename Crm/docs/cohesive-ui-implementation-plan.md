# Cohesive UI Implementation Plan

This document outlines the plan for implementing a cohesive user experience across all modules of the HVAC CRM/ERP system.

## Current State Analysis

After analyzing the codebase, we've identified the following issues:

1. **Inconsistent Page Headers**: Different modules use different header structures and styles.
2. **Inconsistent Loading States**: Loading states are handled differently across modules.
3. **Inconsistent Error Handling**: Error handling is inconsistent or missing in many places.
4. **Inconsistent Empty States**: Empty states are handled differently or not at all.
5. **Inconsistent Layout Structure**: Page layouts vary across modules.

## Implementation Plan

### Phase 1: Foundation (Current)

1. ✅ Create/Update Core Components:
   - PageHeader component
   - DataLoader component
   - CardAction component (for handling nested interactive elements)
   - Storybook stories for documentation

2. ✅ Create Documentation:
   - Core components documentation
   - Implementation plan
   - Best practices

3. ✅ Create Example Implementation:
   - Update dashboard page to use core components

### Phase 2: Core Components (Next)

1. Create Additional Core Components:
   - ErrorBoundary component
   - EmptyState component
   - FilterBar component
   - ActionBar component

2. Update Existing Components:
   - Update MainNav component to be more consistent
   - Update UserNav component to be more consistent
   - Update Search component to be more consistent

3. Create Component Library Documentation:
   - Component catalog
   - Usage guidelines
   - Accessibility guidelines

### Phase 3: Module Updates

1. Update Dashboard Module:
   - Apply core components to all pages
   - Ensure consistent loading states
   - Ensure consistent error handling
   - Ensure consistent empty states

2. Update Customers Module:
   - Apply core components to all pages
   - Ensure consistent loading states
   - Ensure consistent error handling
   - Ensure consistent empty states

3. Update Service Orders Module:
   - Apply core components to all pages
   - Ensure consistent loading states
   - Ensure consistent error handling
   - Ensure consistent empty states

4. Update Remaining Modules:
   - Apply core components to all pages
   - Ensure consistent loading states
   - Ensure consistent error handling
   - Ensure consistent empty states

### Phase 4: Testing and Refinement

1. Accessibility Testing:
   - Test all components for accessibility
   - Ensure WCAG 2.1 compliance
   - Fix any accessibility issues

2. Usability Testing:
   - Test all components for usability
   - Ensure consistent user experience
   - Fix any usability issues

3. Performance Testing:
   - Test all components for performance
   - Ensure fast loading times
   - Fix any performance issues

4. Cross-Browser Testing:
   - Test all components in different browsers
   - Ensure consistent experience across browsers
   - Fix any browser-specific issues

## Implementation Guidelines

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

### Component Usage

1. **PageHeader**: Use for all page headers with consistent title, description, breadcrumbs, and actions.
2. **DataLoader**: Use for all data-driven components with consistent loading, error, and empty states.
3. **MainNav**: Use for all main navigation with consistent styling and active state.
4. **UserNav**: Use for all user navigation with consistent styling and functionality.
5. **Search**: Use for all search functionality with consistent styling and behavior.

### Styling Guidelines

1. **Colors**: Use the theme colors defined in `tailwind.config.ts` and `globals.css`.
2. **Typography**: Use the typography classes defined in `globals.css`.
3. **Spacing**: Use the spacing classes defined in Tailwind CSS.
4. **Components**: Use the components from `@/components/ui/` for all UI elements.

### Accessibility Guidelines

1. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible.
2. **Screen Readers**: Ensure all content is accessible to screen readers.
3. **Color Contrast**: Ensure all text has sufficient color contrast.
4. **Focus Indicators**: Ensure all interactive elements have visible focus indicators.

## Next Steps

1. Review and approve this implementation plan.
2. Begin implementing Phase 2: Core Components.
3. Create a timeline for implementing all phases.
4. Assign resources to each phase.
5. Begin implementation of Phase 2.