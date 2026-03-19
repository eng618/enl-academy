---
description: Prefer @gv-tech/ui-web components before standard or custom components.
applyTo: '**/*'
---

## UI Component Preference (Project-wide)

When implementing UI elements in this repository, prefer components from `@gv-tech/ui-web` before fallbacks to:

- base HTML elements (`button`, `a`, `input`, etc.)
- custom local component implementations

### Implementation guidance

- Always import and use `Button`, `Text`, `Card`, `DropdownMenu`, etc. from `@gv-tech/ui-web` when the behavior is equivalent.
- Only use bare elements if a `@gv-tech/ui-web` component cannot support the needed interaction.
- Document any fallback with a short comment in the component file (e.g., `// fallback due to required native behavior`).

### Example

```tsx
import { Button, Text } from '@gv-tech/ui-web';

export function MyComponent() {
  return (
    <div>
      <Text>Welcome to the planner</Text>
      <Button onClick={() => console.log('click')}>Add event</Button>
    </div>
  );
}
```
