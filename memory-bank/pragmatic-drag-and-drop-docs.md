# Dokumentacja Pragmatic Drag and Drop

Poniżej znajduje się skompilowana dokumentacja dla biblioteki Pragmatic Drag and Drop od Atlassian, pobrana za pomocą Context7.

---

## Testowanie Drag and Drop Między Kolumnami z Cypress
**Opis:** Kompletny przykład testu Cypress demonstrujący testowanie funkcjonalności przeciągnij i upuść poprzez przenoszenie elementu z jednej kolumny do drugiej. Test konfiguruje odpowiednie wyzwalanie DragEvent z obiektem DataTransfer, wykonuje asercje na liczbie elementów w kolumnach przed i po operacji przeciągania.
**Źródło:** https://github.com/atlassian/pragmatic-drag-and-drop/blob/main/packages/documentation/constellation/05-core-package/11-testing/cypress.mdx#2025-04-14_snippet_0

```typescript
it('should allow drag and drop between columns', () => {
	const options = {
		force: true,
		eventConstructor: 'DragEvent',
		// If you wanted to fake dragging particular data,
		// you can add it to this `DataTransfer` with `.setData()`
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer
		dataTransfer: new DataTransfer(),
	};

	cy.visit('/scenario/atlaskit-drag-and-drop');

	// waiting for our board to be visible
	cy.get('[data-testid="item-A0"]').should('be.visible');

	// asserting initial list sizes
	cy.get('[data-testid="column-A--card-list"]')
		.find('[draggable="true"]')
		.should('have.length', 16);

	cy.get('[data-testid="column-B--card-list"]')
		.find('[draggable="true"]')
		.should('have.length', 16);

	// Move A0 to column B
	cy.get('[data-testid="item-A0"]').trigger('dragstart', options);

	cy.get('[data-testid="item-B0"]').trigger('dragenter', options).trigger('drop', options);

	// asserting list sizes after drag and drop
	cy.get('[data-testid="column-A--card-list"]')
		.find('[draggable="true"]')
		.should('have.length', 15);

	cy.get('[data-testid="column-B--card-list"]')
		.find('[draggable="true"]')
		.should('have.length', 17);
});
```

---

## Implementacja Prostego Sprawdzania Typów dla Drag and Drop w TypeScript
**Opis:** Ten fragment kodu demonstruje, jak zaimplementować proste sprawdzanie typów dla elementów przeciągalnych (draggables), celów upuszczania (drop targets) i monitorów (monitors) przy użyciu właściwości 'type' w danych początkowych.
**Źródło:** https://github.com/atlassian/pragmatic-drag-and-drop/blob/main/packages/documentation/constellation/05-core-package/09-recipes/00-isolating-experiences/index.mdx#2025-04-14_snippet_0

```typescript
// bind our draggable
draggable({
	element: myDraggableElement,
	getInitialData: () => ({
		// the id of our card
		cardId,
		// the id the column belongs to
		columnId,
		// specifying this is a "card"
		type: 'card',
	}),
});

dropTargetForElements({
	element: myDropTargetElement,
	getData: () => ({ columnId }),
	// only allow dropping if a "card" is being dragged
	canDrop: ({ source }) => source.data.type === 'card',
});

monitorForElements({
	// only listen for drag operations of "card" draggables
	canMonitor: ({ source }) => source.data.type === 'card',
});
```

---

## Implementacja Przeciągalnej Figury Szachowej z React
**Opis:** Tworzy komponent przeciągalnej figury szachowej przy użyciu funkcji `draggable` z biblioteki Pragmatic Drag and Drop. Komponent przypisuje zachowanie przeciągania do elementu obrazu za pomocą referencji (ref).
**Źródło:** https://github.com/atlassian/pragmatic-drag-and-drop/blob/main/packages/documentation/constellation/01-tutorial/index.mdx#2025-04-14_snippet_0

```tsx
function Piece({ image, alt }: PieceProps) {
	const ref = useRef(null);

	useEffect(() => {
		const el = ref.current;
		invariant(el);

		return draggable({
			element: el,
		});
	}, []);

	return <img css={imageStyles} src={image} alt={alt} ref={ref} />;
}
```

---

## Używanie Funkcji Pomocniczych do Bezpieczeństwa Typów w Pragmatic Drag-and-Drop
**Opis:** Demonstruje zalecany wzorzec tworzenia obiektów danych bezpiecznych typowo przy użyciu kluczy Symbol i funkcji pomocniczych z osłonami typów (type guards). To podejście zapewnia sprawdzanie typów w czasie wykonania i poprawne typowanie w TypeScript.
**Źródło:** https://github.com/atlassian/pragmatic-drag-and-drop/blob/main/packages/documentation/constellation/05-core-package/09-recipes/01-typing-data/index.mdx#2025-04-14_snippet_1

```typescript
import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';

// We are using a `Symbol` to guarentee the whole object is a particular shape
const privateKey = Symbol('Card');

type Card = {
	[privateKey]: true;
	cardId: string;
};

function getCard(data: Omit<Card, typeof privateKey>) {
	return {
		[privateKey]: true,
		...data,
	};
}

export function isCard(data: Record<string | symbol, unknown>): data is Card {
	return Boolean(data[privateKey]);
}

const myDraggable = document.querySelector('#my-draggable');
invariant(myDraggable instanceof HTMLElement);

draggable({
	element: myDraggable,
	getInitialData: () =>
		getCard({
			cardId: '1',
		}),
});

dropTargetForElements({
	element: myDraggable,
	// only allow dropping if dragging a card
	canDrop({ source }) {
		return isCard(source.data);
	},
	onDrop({ source }) {
		const data = source.data;
		if (!isCard(data)) {
			return;
		}
		// data is now correctly typed to `Card`
		console.log(data);
	},
});
```

---

## Aktualizacja Komponentu Square o Dane Lokalizacji w React TSX
**Opis:** Ten fragment kodu pokazuje, jak zmodyfikować komponent Square, aby uwzględnić dane lokalizacji w celu upuszczania. Wykorzystuje hooki `useRef` i `useState` oraz funkcję `dropTargetForElements` z biblioteki Pragmatic Drag and Drop.
**Źródło:** https://github.com/atlassian/pragmatic-drag-and-drop/blob/main/packages/documentation/constellation/01-tutorial/index.mdx#2025-04-14_snippet_8

```tsx
function Square({ pieces, location, children }: SquareProps) {
	const ref = useRef(null);
	const [state, setState] = useState<HoveredState>('idle');

	useEffect(() => {
		const el = ref.current;
		invariant(el);

		return dropTargetForElements({
			element: el,
			getData: () => ({ location }), // NEW

			/*...*/
		});
	});

	/*...*/
}
```

---

## Tworzenie Komponentu Szachowego Pola jako Celu Upuszczania
**Opis:** Implementuje pole szachowe jako cel upuszczania przy użyciu `dropTargetForElements`. Komponent zmienia kolor tła, gdy przeciągalna figura jest nad nim, zapewniając wizualne sprzężenie zwrotne.
**Źródło:** https://github.com/atlassian/pragmatic-drag-and-drop/blob/main/packages/documentation/constellation/01-tutorial/index.mdx#2025-04-14_snippet_2

```tsx
function Square({ location, children }: SquareProps) {
	const ref = useRef(null);
	const [isDraggedOver, setIsDraggedOver] = useState(false);

	useEffect(() => {
		const el = ref.current;
		invariant(el);

		return dropTargetForElements({
			element: el,
			onDragEnter: () => setIsDraggedOver(true),
			onDragLeave: () => setIsDraggedOver(false),
			onDrop: () => setIsDraggedOver(false),
		});
	}, []);

	const isDark = (location[0] + location[1]) % 2 === 1;

	return (
		<div css={squareStyles} style={{ backgroundColor: getColor(isDraggedOver, isDark) }} ref={ref}>
			{children}
		</div>
	);
}
```

---

## Implementacja Wskaźnika Upuszczania Elementu Drzewa w React TSX
**Opis:** Demonstruje, jak używać komponentu Tree Item Drop Indicator w komponencie React z TypeScript. Zawiera stylizację i warunkowe renderowanie w oparciu o instrukcję.
**Źródło:** https://github.com/atlassian/pragmatic-drag-and-drop/blob/main/packages/react-drop-indicator/constellation/index/about.mdx#2025-04-14_snippet_5

```tsx
const itemStyles = css({
	position: 'relative',
	padding: token('space.100'),
	backgroundColor: token('elevation.surface'),
});

export function Item({
	content,
	instruction,
}: {
	content: ReactNode;
	instruction: Instruction | null;
}) {
	return (
		<div css={itemStyles}>
			<span>{content}</span>
			{closestEdge && <DropIndicator instruction={instruction} />}
		</div>
	);
}
```

---

## Implementacja Przeciągalnej Figury Szachowej z Wizualnym Sprzężeniem Zwrotnym
**Opis:** Rozszerza przeciągalną figurę szachową o zarządzanie stanem, aby zapewnić wizualne sprzężenie zwrotne podczas przeciągania. Gdy figura jest przeciągana, jej przezroczystość jest zmniejszana, aby wyglądała, jakby była podnoszona.
**Źródło:** https://github.com/atlassian/pragmatic-drag-and-drop/blob/main/packages/documentation/constellation/01-tutorial/index.mdx#2025-04-14_snippet_1

```tsx
function Piece({ image, alt }: PieceProps) {
	const ref = useRef(null);
	const [dragging, setDragging] = useState<boolean>(false); // NEW

	useEffect(() => {
		const el = ref.current;
		invariant(el);

		return draggable({
			element: el,
			onDragStart: () => setDragging(true), // NEW
			onDrop: () => setDragging(false), // NEW
		});
	}, []);

	return (
		<img
			css={[dragging && hidePieceStyles, imageStyles]} // toggling css using state to hide the piece
			src={image}
			alt={alt}
			ref={ref}
		/>
	);
}
```

---

## Przypisywanie Zachowania Drag and Drop z useEffect w React
**Opis:** Ten przykład demonstruje, jak przypisać zachowanie przeciągania (draggable) i celu upuszczania (drop target) do komponentu React przy użyciu hooka `useEffect`. Pokazuje implementację komponentu Card, który może być zarówno przeciągany, jak i używany jako cel upuszczania dla innych kart.
**Źródło:** https://github.com/atlassian/pragmatic-drag-and-drop/blob/main/packages/documentation/constellation/05-core-package/08-UI-frameworks/react.mdx#2025-04-14_snippet_0

```tsx
// card.tsx
import {draggable, dropTargetForElements} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export default function Card({ item }: { item: Item }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const itemId = item.itemId;
  const [state, setState] = useState<DraggableState>('idle');

  useEffect(() => {
    const cleanup = combine(
      draggable({
        element: ref.current,
        getInitialData: () => ({ type: 'card', itemId: itemId }),
      }),
      dropTargetForElements({
        element: ref.current,
        canDrop: args => args.source.data.type === 'card',
      }),
    );
    return cleanup;
  }, [itemId]);

  return (
    <div ref={ref}>
      item id: {item.itemId}</span>
    </div>
  );
};
```

---

## Importowanie Adapterów Drag and Drop w TypeScript
**Opis:** Demonstruje, jak importować funkcje celu upuszczania (drop target) i monitora (monitor) dla adapterów zewnętrznych, elementowych i wyboru tekstu z pakietu Pragmatic Drag and Drop.
**Źródło:** https://github.com/atlassian/pragmatic-drag-and-drop/blob/main/packages/documentation/constellation/05-core-package/index.mdx#2025-04-14_snippet_1

```typescript
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
```

---

## Tworzenie Celu Upuszczania dla Elementów w Komponencie React
**Opis:** Pokazuje, jak zaimplementować cel upuszczania dla elementów w komponencie React przy użyciu hooków `useRef` i `useEffect`.
**Źródło:** https://github.com/atlassian/pragmatic-drag-and-drop/blob/main/packages/documentation/constellation/05-core-package/03-drop-targets/index.mdx#2025-04-14_snippet_1

```tsx
// basic usage with react
import React, { useEffect, useRef } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

function DropTarget() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      throw new Error('ref not set correctly');
    }

    return dropTargetForElements({
      element: el,
    });
  }, []);

  return <div ref={ref}>Drop elements on me!</div>;
}
```

---

## Zoptymalizowana Implementacja Draggable w React bez Ponownego Montowania
**Opis:** Demonstruje ulepszoną implementację React, która unika niepotrzebnego ponownego montowania elementu przeciągalnego. Wykorzystuje wzorzec aktualizacji funkcji z `setState`, aby wyeliminować potrzebę uwzględniania stanu w tablicy zależności.
**Źródło:** https://github.com/atlassian/pragmatic-drag-and-drop/blob/main/packages/documentation/constellation/05-core-package/07-reconciliation/index.mdx#2025-04-14_snippet_6

```tsx
function Card() {
	const ref = useRef();
	const [dragCount, setCount] = useState(0);

	useEffect(() => {
		return draggable({
			element,
			onDragStart: () => setCount((current) => current + 1),
		});
		// no longer need to remount when `dragCount` changes
	}, []);

	return <div ref={ref}>I have been dragged {dragCount} times</div>;
}
```

---

## Testowanie Callbacków Drag and Drop z Natywnymi Zdarzeniami w TypeScript
**Opis:** Ten kod demonstruje, jak testować funkcjonalność przeciągnij i upuść poprzez wyzwalanie natywnych zdarzeń. Tworzy elementy przeciągalne i cele upuszczania oraz używa API `fireEvent` z `@testing-library/dom` do symulowania interakcji przeciągnij i upuść, weryfikując, czy callbacki są poprawnie wykonywane w odpowiedzi na te zdarzenia.
**Źródło:** https://github.com/atlassian/pragmatic-drag-and-drop/blob/main/packages/documentation/constellation/05-core-package/11-testing/jest-and-jsdom.mdx#2025-04-14_snippet_0

```typescript
import { fireEvent } from '@testing-library/dom';

import {
	draggable,
	dropTargetForElements,
	monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { appendToBody, getElements } from '../../_util';

afterEach(async () => {
	// cleanup any pending drags
	fireEvent.dragEnd(window);

	// Optional: unwind the "honey pot fix"
	// More details: https://www.youtube.com/watch?v=udE9qbFTeQg
	fireEvent.pointerMove(window);
});

it('should execute callbacks in response to native events', () => {
	const [A] = getElements();
	const ordered: string[] = [];

	const cleanup = combine(
		appendToBody(A),
		draggable({
			element: A,
			onGenerateDragPreview: () => ordered.push('draggable:preview'),
			onDragStart: () => ordered.push('draggable:start'),
			onDrag: () => ordered.push('draggable:drag'),
			onDrop: () => ordered.push('draggable:drop'),
			onDropTargetChange: () => ordered.push('draggable:change'),
		}),
		dropTargetForElements({
			element: A,
			onGenerateDragPreview: () => ordered.push('dropTarget:preview'),
			onDragStart: () => ordered.push('dropTarget:start'),
			onDrag: () => ordered.push('dropTarget:drag'),
			onDrop: () => ordered.push('dropTarget:drop'),
			onDropTargetChange: () => ordered.push('dropTarget:change'),
			onDragEnter: () => ordered.push('dropTarget:enter'),
			onDragLeave: () => ordered.push('dropTarget:leave'),
		}),
		monitorForElements({
			onGenerateDragPreview: () => ordered.push('monitor:preview'),
			onDragStart: () => ordered.push('monitor:start'),
			onDrag: () => ordered.push('monitor:drag'),
			onDrop: () => ordered.push('monitor:drop'),
			onDropTargetChange: () => ordered.push('monitor:change'),
		}),
	);

	expect(ordered).toEqual([]);

	// starting a lift, this will trigger the previews to be generated
	fireEvent.dragStart(A);

	expect(ordered).toEqual(['draggable:preview', 'dropTarget:preview', 'monitor:preview']);
	ordered.length = 0;

	// ticking forward an animation frame will complete the lift
	// @ts-expect-error
	requestAnimationFrame.step();
	expect(ordered).toEqual(['draggable:start', 'dropTarget:start', 'monitor:start']);
	ordered.length = 0;

	// [A] -> []
	fireEvent.dragEnter(document.body);
	expect(ordered).toEqual([
		'draggable:change',
		'dropTarget:change',
		'dropTarget:leave',
		'monitor:change',
	]);
	ordered.length = 0;

	// [] -> [A]
	fireEvent.dragEnter(A);
	expect(ordered).toEqual([
		'draggable:change',
		'dropTarget:change',
		'dropTarget:enter',
		'monitor:change',
	]);
	ordered.length = 0;

	// [A] -> [A]
	fireEvent.dragOver(A, { clientX: 10 });
	// no updates yet (need to wait for the next animation frame)
	expect(ordered).toEqual([]);

	// @ts-expect-error
	requestAnimationFrame.step();
	expect(ordered).toEqual(['draggable:drag', 'dropTarget:drag', 'monitor:drag']);
	ordered.length = 0;

	// drop
	fireEvent.drop(A);
	expect(ordered).toEqual(['draggable:drop', 'dropTarget:drop', 'monitor:drop']);

	cleanup();
});
```

---

## Implementacja Ruchu Figury Szachowej z Monitorami w React TSX
**Opis:** Ten fragment kodu demonstruje, jak używać funkcji `monitorForElements` do implementacji ruchu figur szachowych. Zawiera logikę sprawdzania poprawnych ruchów, aktualizacji pozycji figur i obsługi przypadków brzegowych. Kod wykorzystuje hooki React i niestandardowe osłony typów (type guards).
**Źródło:** https://github.com/atlassian/pragmatic-drag-and-drop/blob/main/packages/documentation/constellation/01-tutorial/index.mdx#2025-04-14_snippet_9

```tsx
function Chessboard() {
	const [pieces, setPieces] = useState<PieceRecord[]>([
		{ type: 'king', location: [3, 2] },
		{ type: 'pawn', location: [1, 6] },
	]);

	useEffect(() => {
		return monitorForElements({
			onDrop({ source, location }) {
				const destination = location.current.dropTargets[0];
				if (!destination) {
					// if dropped outside of any drop targets
					return;
				}
				const destinationLocation = destination.data.location;
				const sourceLocation = source.data.location;
				const pieceType = source.data.pieceType;

				if (
					// type guarding
					!isCoord(destinationLocation) ||
					!isCoord(sourceLocation) ||
					!isPieceType(pieceType)
				) {
					return;
				}

				const piece = pieces.find((p) => isEqualCoord(p.location, sourceLocation));
				const restOfPieces = pieces.filter((p) => p !== piece);

				if (
					canMove(sourceLocation, destinationLocation, pieceType, pieces) &&
					piece !== undefined
				) {
					// moving the piece!
					setPieces([{ type: piece.type, location: destinationLocation }, ...restOfPieces]);
				}
			},
		});
	}, [pieces]);

	/*...*/
}
```

---

## Integracja Monitora z Komponentami React przy Użyciu Hooków
**Opis:** Pokazuje, jak zintegrować monitory z komponentami React przy użyciu hooka `useEffect`. Ten wzorzec zapewnia, że monitory są poprawnie czyszczone po odmontowaniu komponentu.
**Źródło:** https://github.com/atlassian/pragmatic-drag-and-drop/blob/main/packages/documentation/constellation/05-core-package/04-monitors/index.mdx#2025-04-14_snippet_1

```tsx
// basic usage with react
import React, { useEffect, useRef } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

function App() {
	// It is often convenient to tie monitors to components using effects
	// By doing this you can ensure you monitors are cleaned up
	// when a component is no longer being used.
	useEffect(() => {
		return monitorForElements({
			onDragStart: () => console.log('I am called whenever any element drag starts'),
		});
	}, []);

	return <div>{/*...*/}</div>;
}