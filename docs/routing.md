<div align="center">
    <h1> Routing </h1>
</div>

## Routing in a Single Page Application

Routing in a Single Page Application (SPA) enables navigation between different views or components based on the URL path **without triggering a full page reload**. This project uses the `react-router-dom` library for routing, which provides a declarative API for mapping URL paths to React components and managing navigation state.

## Routing Architecture

This project uses the `createBrowserRouter` API from React Router to define a hierarchical routing configuration. The structure separates routes into three categories,

- **Public routes** - Accessible without authentication.
- **Protected routes** - Accessible only to authenticated users.

Access control for protected routes is enforced using a custom `ProtectedRoute` component.

The `AccountPrerequisites` component is to force the user to create a profile and prerequisities before accesing the full page.

## Route Creation

All routes are defined inside `routing_routes.ts` and are exported as constants.

When defining routes using React Router the routes the link should be **an absolute path that starts with** `/`. The default behaviour of React Router is such that a plain string without a leading `/` will be appended to the current URL.

This means,

```TSX
export const PROFILE_SETTINGS_ROUTE = "profile/settings";
```

with,

```TSX
<Link to={PROFILE_SETTINGS_ROUTE}>Profile Settings</Link>
```

when on the `/weight-tracking` page, will navigate you to.

```
dashboard/profile/settings
```

Instead, define `PROFILE_SETTINGS_ROUTE` as `"/profile/settings"` to correctly go to `"/profile/settings"`

## Routing Techniques

#### Declarative Routing - Using JSX

The most common and accessible way to handle routing in React is declaratively through JSX components such as `<Link>` and `<NavLink>`. These components render as standard HTML `<a>` tags but are enhanced to work seamlessly within the React Router context. The `<Link to="/path">` is used to navigate to another route without reloading the page. It is ideal for menus, navbars or breadcrumb components where static navigation is required. **Use** `<Link>` **for navigation triggered by user interaction and UI elements**.

```JSX
<Link to={ PROFILE_SETTINGS_ROUTE }>Settings</Link>
```

#### Programmatic Routing - The `useNavigate` Hook

While declarative routing is excellent is excellent for static scenarios, dynamic or logic-based navigation is better handled using the `useNavigate` hook. This hook provides a function that enables imperative navigation.

```TSX
const navigate = useNavigate();

navigate("/dashboard");
navigate("/login", { replace: true }); // avoids back-navigation
```

Use `useNavigate()` for logic-driven routing, such as API responses, user actions or conditionally based on app state.

#### Render-Time Redirection - The `<Navigate />` Component

React Router also supports declarative redirection via the `<Navigate />` component. This is especially useful in components that **need to conditionally reroute users at render time**, such as auth guards.

```TSX
if (!user) return <Navigate to="/login" replace />;
```

Unlike `useNavigate`, `<Navigate />` executes during render and can be used as a drop-in replacement for returned JSX, enabling powerful, clean route guards and redirects without introducing side effects/


## Routing Configuration

The user routing process is primarily broken into a few key stages.

```
 RouterProvider                     ← React‑Router context
 └── RootLayout                     ← Wraps every page with app‑wide providers contexts
     └── ProtectedRoute             ← Checks authentication only
         └── AccountPrerequisites   ← Checks “account prerequisites” (profile, etc...)
             └── Page               ← Real pages the user can explore
```

1. **RouterProvider** - This component serves as the entry point that connects the application to the routing system. It tells React about the router configurations and provides the routing context (`useNavigate`, ...) to the rest of the application. For this reason, `<RouterProvider router={router} />` is defined at the very top and all child components are inside, so we can use the necessary contexts for rerouting.

2. **RootLayout** - The `RootLayout` component exists to place all of the rendered pages within the `AppContextComponent` using `<Outlet /.>`. This will pass down all of the application wide user information to every page such as the user authentication state and user profile. This is necessary as the `ProtectedRoute` will require information from the authentication context and the `AccountPrerequisites` component.

3. **ProtectedRoute** - The `ProtectedRoute` component uses the authentication context to control the routing navigation of the user. If the user is authenticated, it will continue to render further child components. If the user is not authenticated, they will be forcibly routed to `/login`. This asserts that the user will be authenticated when rendering pages and safely perform network requests without user login checks.

4. **AccountPrerequisites** - The `AccountPrerequisites` component acts similar to `ProtectedRoute` where it waits for all user required information to be loaded before continuing. This is primarily used for new user creation and routes the user to pages to create profiles.

5. **Page** - The `Page` is used to represent the current rendered user page, e.g. `<HomePage />`.

```TSX
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AccountPrerequisites />,
            children: [
              { index: true, element: <HomePage /> },
              { path: "weight_tracking", element: <WeightTrackingPage /> },
              ...
            ],
          },
        ],
      },
    ],
  },
]);
```

- `path` - Defines the URL segment for the route.
- `element` - Specifies the React component to render when the route is matched.
- `children` - Defines nested routes beneath the parent route.

In the routing definiton above, there is no path for `<RootLayout />`, this is intentional. We can define `element`-only routes without a `path` to **wrap or guard nested routes**. These are called layout or wrapper routes and they never match a URL directly, **they just render logic or UI** and then pass the request to their child via `<Outlet />`. Layout routes create a new level of UI nesting **but contributes zero characters to the URL**. **The router still renders its `element` whenever any of its children match**. Think of it like middleware layer, it doesn't handle the request itself, but it filters or prepares for what is coming.

React Router evaluates the current URL against your route definitions **top-down**, starting at the outermost router and working through nested `children` routes. For every match in the hierarchy, it **mounts the** `element` **component** and if that component includes `<Outlet />`, it continues rendering the children.

#### Visiting `/login`

This is a public route. Visiting `/login` will perform the following match chain,

```
Route 1: Root route → element: <RootLayout>
Route 2: Child route → path: "/login" → element: <LoginPage>
```

The final rendered result will be,

```TSX
<RootLayout>
  <LoginPage />
</RootLayout>
```

1. `RootLayout` is rendered first. It provides app-wide context and the layout shell.
2. Inside `RootLayout`, an `<Outlet />` placeholder is defined. Since `/login` matches one of its direct children `LoginPage` is rendered in the outlet.

#### Visiting `index`

An `index` route is a **default child route**. It has no `path` and matches exactly when the parent route matches. React router will render the `index` route when its parent path is matched exactly and no child `path` matches. An `index` cannot have children or nested routes.

Visiting `/` will trigger the following match chain.

```
Route 1: Root route         → element: <RootLayout>
Route 2: Child route        → element: <ProtectedRoute>        // no path – layout wrapper
Route 3: Grand‑child route  → element: <AccountPrerequisites>  // no path – layout wrapper
Route 4: Index route        → index: true → element: <HomePage>
```

The final rendered tree will be,

```TSX
<RootLayout>
  <ProtectedRoute>
    <AccountPrerequisites>
      <HomePage />
    </AccountPrerequisites>
  </ProtectedRoute>
</RootLayout>
```

#### Visiting `/weight_tracking`

This is a protected route nested inside two layout guards. If we assume the user is already authenticated and has a profile and visit `/weight_tracking` we will receive the following match chain.

```
Route 1: Root route → element: <RootLayout>
Route 2: Layout → <ProtectedRoute> (no path)
Route 3: Layout → <AccountPrerequisites> (no path)
Route 4: path: "weight_tracking" → <WeightTrackingPage>
```

The final rendered tree will be,

```TSX
<RootLayout>
  <ProtectedRoute>
    <AccountPrerequisites>
      <WeightTrackingPage />
    </AccountPrerequisites>
  </ProtectedRoute>
</RootLayout>
```

1. `RootLayout` is rendered first, always.
2. Inside its `<Outlet />`, `ProtectedRoute` is rendered. It checks if the user is authenticated,
    - If not, it redirects to `/login`.
    - If yes, it renders `<Outlet />`, allowing the next component to load.
3. Next, `AccountPrerequisites` runs. It checks whether the user has a completed profile,
    - If not, it renders the onboarding screen `<CreateProfilePage />`.
    - If yes, it allows the requested page to be rendered via `<Outlet />`.
4. Finally, since `/weight_tracking` matches the last route, `WeightTrackingPage` is mounted inside the outlet.
