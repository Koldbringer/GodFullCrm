Pragmatic drag and drop
Flexible and fast drag and drop for any experience on any tech stack
The core package of Pragmatic drag and drop includes all the essential building blocks for any drag and drop experience. The core package is vanillaJS library (authored in TypeScript) that can be used with any view library (eg react, svelte, vue etc).

# install the core package
yarn add @atlaskit/pragmatic-drag-and-drop
Pragmatic drag and drop is optimised for performance. A key way this is achieved is by only requiring you include the code you actually use for your experience. Within the core package, there are many optional pieces, which are separated into their own entry points

For example:

The element adapter: /element/adapter (@atlaskit/pragmatic-drag-and-drop/element/adapter)
An array reordering utility: /reorder (atlaskit/pragmatic-drag-and-drop/reorder)
And many more!

You can also use our optional packages to streamline the building of your experiences if you want to. Some of these optional packages are tied to specific view technologies (eg @atlaskit/pragmatic-drag-and-drop-react-drop-indicator uses react for rendering and emotion for styling), and those dependencies are made clear in the packages documentation. Where possible, packages don't have any dependency on a view technology (eg @atlaskit/pragmatic-drag-and-drop-hitbox for hitbox information).

Be sure to check out our tutorial to see how to quickly wire up an experience with Pragmatic drag and drop.


Adapters
An adapter teaches Pragmatic drag and drop how to handle dragging a particular entity:

element adapter → handling the dragging of draggable elements
text selection adapter → handling the dragging of text selections
external adapter → handling drag operations that started outside of the current window (eg files and text from other windows or applications)
A drag adapter always provides at least two pieces:

A way of registering drop target (eg dropTargetForElements).
A way to create a monitor (eg monitorForExternal).
import {
    dropTargetForExternal,
    monitorForExternal,
} from '@atlaskit/pragmatic-drag-and-drop/external/adapter';

import {
    dropTargetForElements,
    monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import {
    dropTargetForTextSelection,
    monitorForTextSelection,
} from '@atlaskit/pragmatic-drag-and-drop/text-selection/adapter';
An adapter can also provide additional pieces. For example, the element adapter provides a draggable() function which is a way of registering a HTMLElement as being draggable.

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const cleanup = draggable({
    element: myElement,
});

Drop targets
An Element that can be dropped upon by something that is dragging.

import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';

const cleanup = dropTargetForExternal({
    element: myElement,
});
Learn more about drop targets.


Monitors
A way of listening for @atlaskit/pragmatic-drag-and-drop drag operation events anywhere.

import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const cleanup = monitorForElements({
    element: myElement,
    onDragStart: () => console.log('an element started dragging'),
});
Learn more about monitors.


Utilities
Utilities are small helper functions for common tasks, which are included with the main drag and drop package (e.g. once for simple memoization, or combine to collapse cleanup functions).

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

const cleanup = combine(
    draggable({
        element: myElement,
    }),
    dropTarget({
        element: myElement,
    }),
);

What's next
Head to our adapter documentation to start installing the pieces you need
Learn more about our design and accessibility guidelines.
