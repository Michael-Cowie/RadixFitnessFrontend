<div align="center">
  <h1> Project Architecture </h1>
</div>

## Vite

Vite is a modern frontbuild tool that offers fast development and optimized production builds by leveraging native ES modules and advanced tooling. Before tools like Vite you would likely use Webpack, Parcel or similar. These tools,

1. Bundle the entire app upfront, even for development.
2. Parse and transform all files on startup.
3. Are often slow to start, especially as projects grow.
4. Have slower Hot Module Replacement (HMR) due to full/partial re-bundling.
5. Require heavy configuration to support modern JS features, TypeScript, CSS Modules etc.

Vite fixes the above by fundamentally changing the development model and optimizing the production build process. **Vite is a build tool that,**

1. Starts a development server that serves source files instantly.
2. Processes files (like `.ts`, `.jsx`, `.scss`) using fast transform via esbuild during development.
3. Uses native ESM (ES modules) in the browser, instead of bundling everything first.
4. Provides fast Hot Module Replacement (HMR) for live updates without full reload.
5. Uses Rollup to bundle your code for production, applying optimizations like tree-shaking and minification.

## React

This project utilizes React to construct the user interface. All components are implemented using function-based components, in alignment with the current best practices recommended by the official React documentation.

Functional components are favored over class-based components due to their:

- Simpler and more concise syntax

- Better support for composition

- Integration with React Hooks for managing state, side effects, and lifecycle behavior

## TypeScript

This project is written in TypeScript rather than vanilla JavaScript. TypeScript was selected to enhance code quality, reliability, and maintainability through static type checking.

Using TypeScript provides several key advantages:

- **Improved debugging and developer tooling** through compile-time error detection

- **Better editor support**, including autocompletion, type inference, and inline documentation

- **Safer refactoring** by enabling the compiler to catch type-related errors early

- **Stronger code contracts**, which promote clearer APIs and more predictable behavior

This decision aligns with modern frontend development practices and contributes to a more robust and maintainable codebase over time.

##  CSS

This project uses a combination of **Tailwind CSS, DaisyUI** and **styled-components** to handle styling and UI design.

#### Tailwind CSS

Tailwind CSS is a utility-first CSS framework that allows developers to style elements directly in the markup using predefined utility classes. It promotes rapid development and consistency by avoiding the need to write custom CSS for common styling needs.

```HTML
<div className="bg-white p-4 shadow-md rounded-lg">
  ...
</div>
```

#### DaisyUI

DaisyUI is a component library built on top of Tailwind CSS. It provides a set of pre-designed, accessible UI components (buttons, cards, inputs, modals, ...) that inherit Tailwinds utility-first styling approach.

It simplifies development by allowing developers to use class-based components such as,

```HTML
<button className="btn btn-primary"> Save </button>
```

This helps reduce repetitive UI markup while maintaining the flexibility of Tailwinds customization.

#### styled-components

styled-components is a CSS-in-JS library that enables developers to define component-level styles using tagged template literals in JavaScript or TypeScript. It allows styles to be colocated with the component logic, enhancing encapsulation and maintainability.

```TSX
import React from "react";
import styled from "styled-components";

// Define the styled component
const Separator = styled.div`
  border-top: 2px solid #dadde1;
  margin: 20px 16px;
  width: 100%;
`;

// Use the styled component inside a React component
const ExampleComponent: React.FC = () => {
  return (
    <div>
      <p> Content above the separator </p>
      <Separator />
      <p> Content below the separator </p>
    </div>
  );
};

export default ExampleComponent;
```

<div align="center">
  <h1> Component Structure </h1>
</div>

This approach is used in the project for quick creation of reusable, styled HTML elements where Tailwind or DaisyUI may not be ideal or expressive enough.

#### UI Components

This project leverages **Material-UI (MUI)**, a widely adopted React component library that implements Google's Material Design specifications. Commonly used MUI components in this codebase includes buttons, input fields and form controls providing a consistent and accessible UI foundation.

#### Atomic Design Structure

The UI components follow the **Atomic Design** methodology, organized into three hierarchical layers to promote reusability and maintainaibility.


#### Atoms

Located in `src/atoms`, **atoms are the smallest, most fundamental building blocks of the UI**. They represent simple, highly reusable components such as buttons, inputs, labels and icons. Atoms are intentionally designed to be stateless and free of business logic, serving as raw elements used to compose more complex components.

#### Molecules

Molecules are **composed of one or more atoms combined to form more complex, self-contained UI elements**. Examples include a password input field with an associated visibility toggle or a search bar component. Molecules encapsulate minimal logic required to manage interactions between their consituent atoms.

#### organisms

Organisms are **relatively complex, functional UI sections that group multiple molecules and atoms**. An example is a login form comprising input fields, buttons, validation messages and other interactive elements. Organisms often encapsulate business logic and serve as key building blocks of pages or features.

#### Services

The `src/services` directory contains modules responsible for interacting with the backend APIs. These modules encapsulate HTTP request logic for fetching, updating and managing user data and other external resources, thereby separating data access concerns from UI components.
