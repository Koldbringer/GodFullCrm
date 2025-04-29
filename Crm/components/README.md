# Atomic Design Pattern

Ten folder zawiera komponenty UI zorganizowane według metodologii Atomic Design, która dzieli interfejs użytkownika na pięć poziomów:

## 1. Atoms (Atomy)

Najmniejsze, niepodzielne komponenty UI, takie jak przyciski, pola tekstowe, ikony, etykiety.

```
/atoms
  /button
  /input
  /icon
  /label
  /badge
  ...
```

## 2. Molecules (Molekuły)

Grupy atomów połączone razem, tworzące komponenty o określonej funkcjonalności, np. pole formularza z etykietą i komunikatem o błędzie, przycisk z ikoną.

```
/molecules
  /form-field
  /search-input
  /notification
  /dropdown
  /modal
  ...
```

## 3. Organisms (Organizmy)

Złożone komponenty składające się z molekuł i/lub atomów, tworzące odrębne sekcje interfejsu, np. nagłówek, stopka, formularz rejestracji.

```
/organisms
  /header
  /footer
  /sidebar
  /data-table
  /registration-form
  ...
```

## 4. Templates (Szablony)

Komponenty definiujące układ strony i organizujące organizmy w spójną całość. Szablony nie zawierają konkretnych danych.

```
/templates
  /dashboard-template
  /profile-page-template
  /list-page-template
  /detail-page-template
  ...
```

## 5. Pages (Strony)

Konkretne instancje szablonów z rzeczywistymi danymi. W Next.js strony znajdują się w folderze `app`.

## Zasady nazewnictwa

- Nazwy plików: kebab-case (np. `button.tsx`, `form-field.tsx`)
- Nazwy komponentów: PascalCase (np. `Button`, `FormField`)
- Każdy komponent powinien być eksportowany jako named export
- Każdy komponent powinien mieć zdefiniowany interfejs props

## Struktura plików komponentu

```tsx
// button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'button-base',
          variant === 'outline' && 'button-outline',
          variant === 'ghost' && 'button-ghost',
          size === 'sm' && 'button-sm',
          size === 'lg' && 'button-lg',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
```

## Dokumentacja

Każdy folder zawiera plik README.md z opisem i zasadami dotyczącymi danego poziomu komponentów.
