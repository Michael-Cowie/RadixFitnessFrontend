<div align="center">
  <h1> Development Setup </h1>
</div>

## 1. Dependency Gathering

Dependency management is done via `npm`. The dependencies are listed inside of `package.json` and are gathered by using the command `npm install`.

## 2. Environment Variables

Vite supports the use of environment variables to inject dynamic values into the source code at build time. These values can differ across environments and modes (`development`, `production`, `test`, ...).

By convention, Vite loads environment variables from special `.env` files located in the root of the project. These variables are statically replaced during build time, enabling the bundler to optimize the resulting code by eliminating unused branches or code paths.

Vite supports the following naming conventions for environment variables,

| Filename            | Loaded In                   | Purpose                            |
| ------------------- | --------------------------- | ---------------------------------- |
| `.env`              | All modes                   | Shared variables                   |
| `.env.local`        | All modes (ignored by Git)  | Developer-specific overrides       |
| `.env.development`  | Development mode only       | Variables specific to development  |
| `.env.production`   | Production mode only        | Variables specific to production   |
| `.env.[mode].local` | Specific mode (Git ignored) | Local overrides for specific modes |

Vite determines the active mode via the `--mode` CLI flag or defaults to `development` when running the dev server via `vite dev`. To prevent accidental leakage of sensitive information into the client-side bundle, Vite uses a strict naming convention, **only variables prefixed with** `VITE_` **are exposed to the application** through `import.meta.env`.

Therefore, `npm run dev` or `npm run dev --mode development` will automatically load,

- `.env`
- `.env.local`
- `.env.development`
- `.env.development.local`

Within this base project I primarily have configured `.env.development`.

`.env.development`

```ini
VITE_API_END_POINT=https://localhost:1337
SECRET_KEY=should_not_be_exposed
```

`example.com`

```JavaScript
console.log(import.meta.env.VITE_API_END_POINT); // accessible
console.log(import.meta.env.SECRET_KEY);         // undefined
```

## 3. Code Linters

Maintaining consistent and high-quality code is essential in modern development. ESLint and Prettier are two widely adopted tools that address this need and are used throughout this project. Each have distinct roles. ESLint focuses on code correctness and style enforcement, Prettier ensures consistent formatting.

GitHub actions is configured to make these checks once pushed.

#### ESLint

ESLint is a linter for JavaScript and TypeScript. It analyzes source code to identify syntax errors, potential bugs and deviations from coding standards. It supports,

- **Code Correctness** - This can include unused variables and unreachable code.
- **Best Practices** - This can include preferring `const` over `var`.
- **Styles Rules** - This can include spacing and semicolons.

ESLint is configured in the `package.json` with the following configuration,

```JSON
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    ...
  },
```

It can therefore be checked running `npx eslint . --ext .ts,.tsx,.js,.jsx --fix` which can help auto in automatic fixes.

ESLint can be included as a VS Code extension for automatic formatting.

<div align="center">
  <img src="./images/ESLint_extension.png">
</div>

Once the extension has been installed `View → Problems` show the list of current problems found by ESLint.

<div align="center">
  <img src="./images/ESLint_example.png">
</div>

#### Prettier

Prettier is a code formatter that enforces a uniform appearance by reprinting code using predefined formatting rules. It focuses exclusively on code style,

- Indentation
- Line length
- Quote style
- Trailing commas

Unlike ESLint, Prettier has minimal configuration and avoids debates about formatting preferences by enforcing consistent output. Prettier style enforcement is required via GitHub actions.

VS Code has a Prettier extenson which can be installed.

<div align="center">
  <img src="./images/prettier_code_formatter.png">
</div>

Once installed, within user settings `Ctrl + Shift + P` → `Preferences: Open Settings (UI)` the section `Default Formatter` can select `Prettier - Code formatter`.

<div align="center">
  <img src="./images/prettier_default_formatter.png">
</div>

Finally, configure this to be ran when saving.

<div align="center">
  <img src="./images/format_on_save.png">
</div>

## 4. Debugging in Visual Studio Code

##### Create a `launch.json` File

<div align="center">
    <img src="./images/run_and_debug_tab.png"/>
</div>

##### Click `Web App (Chrome)`

<div align="center">
    <img src="./images/web_app_chrome.png"/>
</div>

#### Fix the `launch.json` Default

The `launch.json` file will be created under `.vscode`. The default port in the `launch.json` will be `8080`. The default port for Vite will be `5173`. Therefore, update the port to be `5173`.

```JSON
"url": "http://localhost:5173",
```

#### Launch the Debugger

<div align="center">
    <img src="./images/launch_debugger.png"/>
</div>

## 5. Starting the Development Server

To start the server, run the command `npm run dev`. This will run the `dev` command configured inside of `package.json` under the `"scripts"` sections.

```JSON
  "scripts": {
    "dev": "vite",
    ...
  }
```
