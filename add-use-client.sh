#!/bin/bash

# Add "use client" directive to component files that use React hooks
find ./Crm/components -type f -name "*.tsx" -exec grep -l "useState\|useEffect\|useContext\|useReducer\|useCallback\|useMemo\|useRef\|useImperativeHandle\|useLayoutEffect\|useDebugValue" {} \; | xargs -I{} sed -i '1s/^/"use client";\n/' {}

# Also add to specific files mentioned in the error
if [ -f "./Crm/components/offers/OfferGeneratorForm.tsx" ]; then
  sed -i '1s/^/"use client";\n/' ./Crm/components/offers/OfferGeneratorForm.tsx
fi

echo "Added 'use client' directive to component files"