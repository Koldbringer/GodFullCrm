
An adapter teaches Pragmatic drag and drop how to handle dragging a particular entity type:

element adapter → handling the dragging of draggable elements
text selection adapter → handling the dragging of text selections
external adapter → handling drag operations that started outside of the current window (eg files and text from other windows or applications)
Element adapter
Create, respond to and listen to element drag operations
About
Drag previews
Unregistered elements
Other utilities
The element adapter enables you to create rich drag and drop experiences, such as lists, boards, grids, resizing and so on.

The element adapter contains the essential pieces for element operations:

draggable: enable dragging of an element.
dropTargetForElements: marking an element as a valid drop target
monitorForElements: create a monitor to listen for element drag operation events anywhere.
types: all types for this adapter.
There are also a number of optional element utilities:

setCustomNativeDragPreview: use a new element as the native drag preview
pointerOutsideOfPreview: native drag preview function to place the users pointer outside of the drag preview
centerUnderPointer: native drag preview function to place the center of the ntaive drag preview under the users pointer
preserveOffsetOnSource: native drag preview function to match the pointer position on a native drag preview as close as possible to the pointer position on the draggable element
disableNativeDragPreview: disable the native drag preview (helpful if you want to use your own custom drag preview or have no drag preview)
scrollJustEnoughIntoView: scroll an element just enough into view so it is visible (helpful when working with default native drag previews)
It is likely that some top level utilities will be helpful for your experience as well


Draggable
A draggable is an HTMLElement that can be dragged around by a user.

A draggable can be located:

Outside of any drop targets
Inside any amount of levels of nested drop targets
So, anywhere!
While a drag operation is occurring:

You can add new draggables
You can remount a draggable. See Reconciliation
You can change the dimensions of the dragging draggable during a drag. But keep in mind that won't change the drag preview image, as that is collected only at the start of the drag (in onGenerateDragPreview())
You can remove the dragging draggable during a drag operation. When a draggable is removed it's event functions (eg onDrag) will no longer be called. Being able to remove the dragging draggable is a common requirement for virtual lists

Draggable argument overview
element: HTMLElement: a HTMLElement that will be draggable (using HTMLElement as that is the interface that allows the "draggable" attribute)
dragHandle?: Element: an optional Element that can be used to designate the part of the draggable that can exclusively used to drag the whole draggable
canDrag?: (args: GetFeedbackArgs) => boolean: used to conditionally allow dragging (see below)
getInitialData?: (args: GetFeedbackArgs) => Record<string, unknown>: a one time attaching of data to a draggable as a drag is starting. If you want to understand the type of data attached to a drop target elsewhere in your application, see our typing data guide.
getInitialDataForExternal?: (args: GetFeedbackArgs) => {[Key in NativeMediaType]?: string;}: used to attach native data (eg "text/plain") to other windows or applications.
type GetFeedbackArgs = {
    /**
     * The user input as a drag is trying to start (the `initial` input)
     */
    input: Input;
    /**
     * The `draggable` element
     */
    element: HTMLElement;
    /**
     * The `dragHandle` element for the `draggable`
     */
    dragHandle: Element | null;
};
onGenerateDragPreview
onDragStart
onDrag
onDropTargetChange
onDrop

Drag handles
A drag handle is the part of your draggable element that can be dragged in order to drag the whole draggable. By default, the entire draggable acts as a drag handle. However, you can optionally mark a child element of a draggable element as the drag handle.

draggable({
    element: myElement,
    dragHandle: myDragHandleElement,
});
You can also implement a drag handle by making a small part of an element the draggable, and then using setCustomNativeDragPreview to generate a preview for the entire entity.


Conditional dragging (canDrag())
A draggable can conditionally allow dragging by using the canDrag() function. Returning true from canDrag() will allow the drag, and returning false will prevent a drag.

draggable({
    element: myElement,
    // disable dragging
    canDrag: () => false,
});
Drop on me!
Last dropped: none


Disabling a drag by returning false from canDrag() will prevent any other draggable on the page from being dragged. @atlaskit/pragmatic-drag-and-drop calls event.preventDefault() under the hood when canDrag() returns false, which cancels the drag operation. Unfortunately, once a drag event has started, a draggable element cannot individually opt out of dragging and allow another element to be dragged.

If you want to disable dragging for a draggable, but still want a parent draggable to be able to be dragged, then rather than using canDrag() you can conditionally apply draggable()

Here is example of what that could look like using react:

import { useEffect } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

function noop(){};

function Item({isDraggingEnabled}: {isDraggingEnabled: boolean}) {
  const ref = useRef();

  useEffect({
    // when disabled, don't make the element draggable
    // this will allow a parent draggable to still be dragged
    if(!isDraggingEnabled) {
      return noop;
    }
    return draggable({
      element: ref.current,
    });
  }, [isDraggingEnabled]);

  return <div ref={ref}>Draggable item</div>
};

Data for external consumers (getInitialDataForExternal())
getInitialDataForExternal() allows you want to attach data to a drag operation that can be used by other windowss or applications (externally)

draggable({
    element: myElement,
    getInitialData: () => ({ taskId: task.id }),
    getInitialDataForExternal: () => ({
        'text/plain': task.description,
        'text/uri-list': task.url,
    }),
});
We also have a helper formatURLsForExternal(urls: string[]): string that allows you to attach multiple urls for external consumers.

import { formatURLsForExternal } from '@atlaskit/pragmatic-drag-and-drop/element/format-urls-for-external';

draggable({
    element: myElement,
    getInitialData: () => ({ taskId: task.id }),
    getInitialDataForExternal: () => ({
        'text/plain': task.description,
        'text/uri-list': formatURLsForExternal([task.url, task.anotherUrl]),
    }),
});
Data attached for external consumers can be accessed by any external consumer that the user drops on. It is important that you don't expose private data.

Attaching external data from a draggable will not trigger the external adapter in the window that the draggable started in, but it will trigger the external adapter in other windows (eg in <iframe>s).


Drop target for elements
A drop target for elements.

The default dropEffect for this type of drop target is "move". This lines up with our design guides. You can override this default with getDropEffect().

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const cleanup = dropTargetForElements({
  element: myElement,
  onDragStart: () => console.log('Something started dragging in me!');
});

Monitor for elements
A monitor for elements.

import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const cleanup = monitorForElements({
  onDragStart: () => console.log('Dragging an element');
});

Types
Generally you won't need to explicitly use our provided types, but we expose a number of TypeScript types if you would like to use them.

All events on draggables, drop targets and monitors, are given the following base payload:

type ElementEventBasePayload = {
    location: DragLocationHistory;
    source: ElementDragPayload;
};

type ElementDragPayload = {
    element: HTMLElement;
    dragHandle: Element | null;
    data: Record<string, unknown>;
};
For all the arguments for all events, you can use our event map type:

type ElementEventPayloadMap = {
    onDragStart: ElementEventBasePayload;
    // .. the rest of the events
};
Draggable feedback functions (canDrag, getInitialData, getInitialDataForExternal) are given the following:

type ElementGetFeedbackArgs = {
    /**
     * The user input as a drag is trying to start (the `initial` input)
     */
    input: Input;
    /**
     * The `draggable` element
     */
    element: HTMLElement;
    /**
     * The `dragHandle` element for the `draggable`
     */
    dragHandle: Element | null;
};
Drop targets are given a little bit more information in each event:

type ElementDropTargetEventBasePayload = ElementEventBasePayload & {
    /**
     * A convenance pointer to this drop targets values
     */
    self: DropTargetRecord;
};
For all arguments for all events on drop targets, you can use our event map type:

type ElementDropTargetEventPayloadMap = {
    onDragStart: ElementDropTargetEventBasePayload;
    // .. the rest of the events
};
Drop target feedback functions (canDrop, getData, getDropEffect, getIsSticky) are given the following:

type ElementDropTargetGetFeedbackArgs = {
    /**
     * The users _current_ input
     */
    input: Input;
    /**
     * The data associated with the entity being dragged
     */
    source: ElementDragPayload;
    /**
     * This drop target's element
     */
    element: Element;
};
The monitor feedback function (canMonitor), is given the following:

type ElementMonitorGetFeedbackArgs = {
    /**
     * The users `initial` drag location
     */
    initial: DragLocation;
    /**
     * The data associated with the entity being dragged
     */
    source: ElementDragPayload;
};
You can get these type from the element adapter import:

import type {
    // Payload for the draggable being dragged
    ElementDragPayload,
    // Base events
    ElementEventBasePayload,
    ElementEventPayloadMap,
    // Drop target events
    ElementDropTargetEventBasePayload,
    ElementDropTargetEventPayloadMap,
    // Feedback types
    ElementGetFeedbackArgs,
    ElementDropTargetGetFeedbackArgs,
    ElementMonitorGetFeedbackArgs,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
There are also some types (eg DropTargetLocation) that can be used for all adapters which can be found on our top level utilities page


Further reading
Drag preview documentation → how to control what the user drags around during a drag
Typing data → how to improve the types for "data"
Unregistered elements
 drag preview is the thing that a user drags around during a drag operation. We have a number of supported techniques for controlling what the drag preview looks like.


Native drag previews
We recommend using native drag previews where possible as they have great performance characteristics (they are not rendered on the main thread) and they can be dragged between applications

Browsers have built in "native" mechanisms for rendering a drag preview

There are a few techniques you can use to control what a native drag preview will look like:


Approach 1: Use a custom native drag preview
You can ask the browser to take a photo of another visible element on the page and use that as the drag preview. There are some design constraints when leveraging native drag previews.

There are lots of platform gotchas when working with custom native drag previews. We recommend using our setCustomNativeDragPreview() as it makes it safe and easy to work with custom native drag previews.

Mounting a new element with setCustomNativeDragPreview
You can use setCustomNativeDragPreview to mount a new element to the page to be used as the drag preview. setCustomNativeDragPreview will call your cleanup function to remove the preview element from the page after the browser has taken a photo of the element. setCustomNativeDragPreview adds the container Element to the document.body and will remove the container Element after your cleanup function is called.

setCustomNativeDragPreview has been designed to work with any view abstraction.

Note: you are welcome to use the onGenerateDragPreview | nativeSetDragImage API directly. However, we recommend you use setCustomNativeDragPreview as it covers over a number of gotchas.

Usage example: react portals
This technique requires your component to be re-rendered, but maintains the current react context

type State =
    | {
            type: 'idle';
      }
    | {
            type: 'preview';
            container: HTMLElement;
      };

function Item() {
    const [state, setState] = useState<State>({ type: 'idle' });
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        invariant(ref.current);

        return draggable({
            element: ref.current,
            onGenerateDragPreview({ nativeSetDragImage }) {
                setCustomNativeDragPreview({
                    render({ container }) {
                        // Cause a `react` re-render to create your portal synchronously
                        setState({ type: 'preview', container });
                        // In our cleanup function: cause a `react` re-render to create remove your portal
                        // Note: you can also remove the portal in `onDragStart`,
                        // which is when the cleanup function is called
                        return () => setState({ type: 'idle' });
                    },
                    nativeSetDragImage,
                });
            },
        });
    }, []);

    return (
        <>
            <div ref={ref}>Drag Me</div>
            {state.type === 'preview' ? ReactDOM.createPortal(<Preview />, state.container) : null}
        </>
    );
}
Usage example: A new react application
This technique requires no re-rendering of your component, but does not maintain the current react context

import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';

draggable({
    element: myElement,
    onGenerateDragPreview: ({ nativeSetDragImage }) => {
        setCustomNativeDragPreview({
            render({ container }) {
                ReactDOM.render(<Preview item={item} />, container);
                return function cleanup() {
                    ReactDOM.unmountComponentAtNode(container);
                };
            },
            nativeSetDragImage,
        });
    },
});
Usage example: plain JavaScript
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';

draggable({
    element: myElement,
    onGenerateDragPreview: ({ nativeSetDragImage }) => {
        setCustomNativeDragPreview({
            render({ container }) {
                // Create our preview element
                const preview = document.createElement('div');

                // Populate and style the preview element however you like
                preview.textContent = 'My Preview';
                Object.assign(preview.style, {
                    padding: '20px',
                    backgroundColor: 'lightpink',
                });

                // put the "preview" element into the container element
                container.appendChild(preview);
            },
            nativeSetDragImage,
        });
    },
});
Positioning the drag preview
You can control where the custom native drag preview is placed by using the getOffset() argument.

You can return an {x: number, y: number} object from getOffset() which will control where the native drag preview is rendered relative to the users pointer. {x: 0, y: 0} represents having the users pointer user the top left corner of the drag preview.

For clarity:

const rect = container.getBoundingClientRect()
{x: 0, y: 0} → top left of the container will be under the users pointer (default)
{x: rect.width, y: 0} top right of the container will be under the users pointer
{x: rect.width, y: rect.height} bottom right of the container will be under the users pointer
{x: 0, y: rect.height} bottom left of the container will be under the users pointer
type GetOffsetFn = (args: { container: HTMLElement }) => {
    x: number;
    y: number;
};
Notes:

GetOffsetFn needs to return x and y as numbers as that is what the platform requires
You cannot use negative values (not supported by browsers). If you want to push the drag preview away from the users pointer, use offsetFromPointer (see below)
The max offset value for an axis is the border-box. Values greater than the border-box get trimmed to be the border-box value
getOffset is called in the next microtask after setCustomNativeDragPreview:render. This helps ensure that the drag preview element has finished rendering into the container before getOffset is called. Some frameworks like react@18 won't render the element to be used for the drag preview into the container until the next microtask.
{x: rect.width + 1, y: rect.height + 1} effectively becomes {x: rect.width, y: rect.height}.

import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';

draggable({
    element: myElement,
    onGenerateDragPreview: ({ nativeSetDragImage }) => {
        setCustomNativeDragPreview({
            // place the (near) top middle of the `container` under the users pointer
            getOffset: () => {
                const rect = container.getBoundingClientRect();
                return { x: rect.width / 2, y: 16 };
            },
            render({ container }) {
                ReactDOM.render(<Preview item={item} />, container);
                return function cleanup() {
                    ReactDOM.unmountComponentAtNode(container);
                };
            },
            nativeSetDragImage,
        });
    },
});
We have getOffset() helpers for setCustomnativeDragPreview():

centerUnderPointer: centers the custom native drag preview under the users cursor
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { centerUnderPointer } from '@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer';

draggable({
    element: myElement,
    onGenerateDragPreview: ({ nativeSetDragImage }) => {
        setCustomNativeDragPreview({
            getOffset: centerUnderPointer,
            render({ container }) {
                /* ... */
            },
            nativeSetDragImage,
        });
    },
});
pointerOutsideOfPreview: a cross browser mechanism to place the pointer outside of the drag preview
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';

draggable({
    element: myElement,
    onGenerateDragPreview: ({ nativeSetDragImage }) => {
        setCustomNativeDragPreview({
            // `x` and `y` can be any CSS value
            getOffset: pointerOutsideOfPreview({
                x: '8px',
                y: 'calc(var(--grid) * 2)',
            }),
            render({ container }) {
                /* ... */
            },
            nativeSetDragImage,
        });
    },
});
Note: if you are using css variables inside of your getOffset() you need to be sure your css variables are available at the <body> element, as the container is temporarily mounted as a child of <body>

preserveOffsetOnSource: applies the initial cursor offset to the custom native drag preview for a seamless experience
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';

draggable({
    element: myElement,
    onGenerateDragPreview: ({ nativeSetDragImage, location, source }) => {
        setCustomNativeDragPreview({
            getOffset: preserveOffsetOnSource({
                element: source.element,
                input: location.current.input,
            }),
            render({ container }) {
                /* ... */
            },
            nativeSetDragImage,
        });
    },
});
Note: this helper works best when the rendered preview has the same dimensions as the dragged element

Gotcha: CSS transforms
When creating custom drag preview element with setCustomNativeDragPreview, there is mixed support for applying CSS transforms to the drag preview element.

Scale	Rotate	Translate (avoid)
Chrome (114.0)			
Firefox (115.0)			
Safari (16.5.2)	 (broken)	 (broken)	 (broken)
Avoid using translate for positioning a drag preview (or pushing it away from the cursor). Please use setCustomNativeDragPreview > getOffset for that (see above)

You can use CSS transforms as a progressive enhancement. For Chrome and Firefox you can use CSS transforms, but for Safari you cannot. You will need do a browser check for Safari, and only add CSS transforms to your preview element when the browser is not Safari.

const isSafari: boolean =
    navigator.userAgent.includes('AppleWebKit') && !navigator.userAgent.includes('Chrome');

const transformStyles = css({
    transform: 'scale(4deg)',
});

function Preview() {
    return <div css={isSafari ? transformStyles : undefined}>Drag preview</div>;
}

Approach 2: Change the appearance of a draggable
This approach has the best performance characteristics, but is subject to a number of gotchas. For most consumers we recommend using setCustomNativeDragPreview

If you do nothing, then the browser will use a picture of the draggable element as the drag preview. By leveraging event timings you can control the appearance of the drag preview that the browser generates:

in onGenerateDragPreview make whatever visual changes you want to the draggable element and those changes will be captured in the drag preview

in onDragStart:

2a. revert changes of step 1. The user will never see the draggable element with the styles applied in onGenerateDragPreview due to paint timings

2b. apply visual changes to the draggable element to make it clear to the user what element is being dragged

in onDrop remove any visual changes you applied to the draggable element during the drag

More information about how this technique works 🧑‍🔬
There are a few constraints imposed by browsers that you need to follow if you want to use this technique:

Your draggable needs to be completely visible and unobfiscated at the start of the drag. This can involve insuring that your draggable is not cut off by scroll (see scrollJustEnoughIntoView), and has no layers currently on top of the draggable (for example, you might need to close some popups)
The users pointer still needs to be over the draggable after the changes you make to the draggable element in onGenerateDragPreview. Generally this means that you should not be changing the dimensions of the draggable element.
Avoid CSS transform on your draggable. In Safari, CSS transforms that impact a draggable can mess up native drag previews.
Bug 1 when a transform impacts a draggablebefore a drag starts:
Bug 2 when CSS transform is applied to a draggable element in onGenerateDragPreview

Non-native custom drag previews
In some situations, you might want to completely disable the native drag preview and render your own drag preview. The advantage of this technique is that you can update the drag preview during a drag. The downsides of this approach is that it is not as fast, and you cannot drag the non-native drag preview outside of a browser window.

To use this technique:

disable the native drag preview
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';

draggable({
    element: myElement,
    onGenerateDragPreview({ nativeSetDragPreview }) {
        disableNativeDragPreview({ nativeSetDragPreview });
    },
});
This technique renders a 1x1 transparent image as the native drag preview. There are a few alternative techniques for hiding the drag preview, but this technique yielded the best results across many browsers and devices.
render your own element in onDragStart (ideally in a portal), and under the user's pointer (you can use location.initial.input to get the users initial position)
move the new element around in response to onDrag events (use location.current.input to get the users current pointer position)
remove the new element in onDrop
If you are doing this technique, you will likely want to use the preventUnhandled utility. Using that addon will prevent the strange situation where when the user does not drop on a drop target there is a fairly large pause before the drop event. This is because the browser does a drop animation when the user does not drop on a drop target; a "return home" animation. Because you have hidden the native drag preview, the user won't see this return home drop animation, but will experience a delay. Using the preventUnhandled utility ensures that the return home drop animation won't run


No drag preview
For some experiences you might not want any drag preview (for example, resizing). All you need to do is disable the native drag preview and you are good to go.

import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';

draggable({
    element: myElement,
    onGenerateDragPreview({ nativeSetDragPreview }) {
        disableNativeDragPreview({ nativeSetDragPreview });
    },
});

scrollJustEnoughIntoView
A little utility to quickly scroll something into view before a drag preview is captured. This is helpful if you are leveraging default drag previews (ie not using setCustomNativeDragPreview). If the draggable element is not completely in view, then the drag preview can be cut off.

import { scrollJustEnoughIntoView } from '@atlaskit/pragmatic-drag-and-drop/element/scroll-just-enough-into-view';

draggable({
    element: myElement,
    onGenerateDragPreview({ source }) {
        scrollJustEnoughIntoView({ element: source.element });
    },
});
Contents
Native drag previews
Approach 1: Use a custom native drag preview
Approach 2: Change the appearance of a draggable
Non-native custom drag previews
No drag preview
scrollJustEnoughIntoView
Was this page helpful?

Yes

No
We use this feedback to improve our documentation.ny HTMLElement can become draggable in the browser by adding the attribute draggable="true" to that element. Additionally, <a> and <img> elements are draggable by default (as if they had draggable="true" set on them).

The element adapter is only activated by explicitly registered elements (ie draggable({element})). The element adapter will not be activated by other draggable elements on the page.

If you want the element adapter to be activated by any element (including <a> or <img> elements), then you need to register it as a draggable()

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

draggable({
    element: myAnchor,
});

Disable default dragging of anchors and images
If you want to disable browsers default setting of draggable="true" on <a> and <img> elements, you can set draggable="false"

<a href="/home" draggable="false">Home</a>

External data for anchors and images
When dragging a <a> or <img> element, they will automatically attach some data for external consumers. For example <a> will attach "text/uri-list" matching the dragging URL.

Registering anchors or images as a draggable() does not impact this default assignment of external data

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

// "text/plain" and "text/uri-list" external data will automatically be attached
// by the browser
draggable({
    element: myAnchor,
});
You can change the default external data values by using getInitialDataForExternal()

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

draggable({
    element: myAnchor,
    getInitialDataForExternal: () => ({
        // overiding the standard "text/uri-list" value
        'text/uri-list': someOtherUrl,
        // adding some new value
        'application/x.something-custom': myCustomData,
    }),
});

Drag previews for anchors and images
Browsers will automatically generate a drag preview when dragging <a> or <img> elements, even when those elements are registered as a draggable().

You can control this drag preview in the same wblockDraggingToIFrames
This optional utility disables the ability for a user to drag into an <iframe> element.

Scenarios where this can be helpful:

When you are shifting the interface around in reponse to a drag operation and you don't want the drag to enter into an <iframe> (for example - when resizing)
When you don't want the user to be able to drag into a <iframe> on the page (there could be lots of reasons why!)
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { blockDraggingToIFrames } from '@atlaskit/pragmatic-drag-and-drop/element/block-dragging-to-iframes';

const cleanup = combine(
    blockDraggingToIFrames({ element }),
    draggable({
        element,
    }),
);
This function sets pointer-events:none !important to all <iframe> elements for the duration of the drag.
Once an <iframe> is disabled, it will only be re-enabled once the current drag interaction is completed (and not when the CleanupFn is called)
This function currently does not watch for new <iframe> elements being adding during a drag operation.
