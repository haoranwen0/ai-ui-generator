# Octo Startup Template

## Tech Stack

### Frontend

- React.js with TypeScript
- Chakra UI Framework
  - Read their UI component Documentation [Here](https://v2.chakra-ui.com/docs/components)

### Backend

- Firebase [**Not Integrated Yet**]

## Styling

### Formatter Settings

- Uses [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) formatter
- `Ctrl` + `,` to open VS Code settings
  1. Search 'formatter'
  2. Set default formatter to Prettier for **Editor: Default Formatter**
  3. Check **ON** for **Editor: Format On Paste** and **Editor: Format On Save**
  4. Search 'semicolon'
  5. Check **OFF** for **Prettier: Semi**
  6. Search 'single'
  7. Check **ON** for **Prettier: Jsx Single Quote**, **Prettier: Single Quote**, and **Prettier: Single Attribute Per Line**

### General ESLint Rules

- No semicolons
- No double quotes
- Uses 2 spaces for indentation

### React Import Rules

- 3 import groups

  - Native react.js imports
  - Package imports
  - Codebase file imports

- Within each group, import location is sorted alphabetically
- If importing multiple things one a package, those are also sorted alphabetically

```TypeScript
// Native React.js Imports First
import React from 'react'

// Package Imports Second
import { ChakraProvider } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

// Codebase File Imports Third
import App from './App'
// Multiple imports in the same file are also sorted alphabetically
import { persistor, store } from './redux/store'
```
