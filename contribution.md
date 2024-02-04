# Architecture

A quick note on the folder structure is as follows,

### Atoms

Components inside the `src/atoms` location are very specific components that are *tiny* are are generally used *within a molecule*. It contains the smallest and most basic building blocks of the application, such as buttons, inputs. Atoms should be highly reusable and not contain any business logic.

### Molecule

Molecules are composed of *one or more atoms* and represent more complex UI elements such as password input and search bar.

### Organism

Organisms are groups of molecules and atoms that form a complete functional section of the application. For instance, a login form with input fields, a button, and error messages.

### Services

The `src/services` folder contains files that talk to the backend and contain logic that performs HTTP requests to retrieve user data.

# Import sorting

The order of imports is defined by using the extension [TypeScript Import Sorter](https://marketplace.visualstudio.com/items?itemName=mike-co.import-sorter)