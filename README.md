# MyFigmaApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.15.

## Development server

To start a local development server, run:

```bash
ng serve
# MyFigmaApp

Lightweight Angular mock app for an interior-design demo site. Includes pages for Home, Events and an Admin area, plus a simple authentication mock, role-based admin access and a light/dark theme toggle.

This repository was built with Angular standalone components and an app-config based bootstrap.

## Quick start (Windows PowerShell)

1. Install dependencies (run once):

```powershell
npm install
```

2. Start the dev server:

```powershell
npm start
```

The CLI may prompt to use a different port if 4200 is already in use — answer `Yes` (or `Y`) and the dev server will run on an available port (the console will show the final URL).

Open the URL shown in the terminal (e.g. http://localhost:4200 or http://localhost:55668) to view the app.

## Features

- Pages: `/` (Home), `/events` (Events list), `/events/:id` (Event detail), `/admin` (Admin panel).
- Authentication: simple mock `AuthService` with `login` and `signup` methods. Signing up or logging in persists a mock user in localStorage. Any email containing the substring `admin` will be assigned the `admin` role by the mock.
- Role-based protection: `/admin` is protected with a route guard and will redirect to `/` when accessed by non-admin users.
- Theme toggle: light/dark mode toggle in the nav bar — preference is stored in localStorage and applied across reloads.

## How to use the demo auth

1. Click Sign Up and choose a role: `admin` or `user`. OR sign up/login with an email containing `admin` to get admin access.
2. After signing in as `admin`, the `Admin` link will appear in the navigation.
3. Use Logout to clear the session.

Note: This is a mock auth implementation for local development only. Replace `AuthService` with real API calls for production.

## Troubleshooting

- "Port 4200 is already in use": When prompted by the Angular CLI, type `Y` (or `Yes`) to run the dev server on another port. The console will print the new URL.
- "Cannot read properties of undefined (reading 'getItem')" during dev-start: this occurs when code tries to access localStorage in contexts where it isn't available (for example during certain Vite/SSR initialization steps). The project includes guards in `src/app/auth.service.ts` to check for localStorage availability before reading/writing. If you still see this error, restart the dev server after saving changes.

## Routes / components quick map

- `src/app/app.routes.ts` — app routes configuration
- `src/app/auth.service.ts` — mock auth + localStorage persistence
- `src/app/auth.guard.ts` — `authGuard` and `adminGuard` helpers
- `src/app/login.component.ts` — login form
- `src/app/signup.component.ts` — signup form
- `src/app/app.component.ts` — main layout, nav and theme toggle

## Development notes

- The mock auth stores a small user object in localStorage under the key `currentUser`.
- Admin detection is performed by reading the stored user's `role` value.
- To adapt to a backend, replace `AuthService.login` and `AuthService.signup` with HTTP calls to your API and update the guards accordingly.

If you want, I can:

- Add a simple in-memory user store instead of localStorage for easier testing.
- Wire a real authentication backend (example with Firebase or a simple Express API).

If you run into any errors when starting the server, paste the terminal output here and I'll fix them.

## Commands (PowerShell)

Here is a concise list of commands for common operations. Use these in Windows PowerShell from the project root (`my-figma-app`). If a command accepts extra flags you can append them after `--` when calling via `npm` (examples shown).

- Install dependencies (run once):

```powershell
npm install
```

- Start the dev server (interactive, opens browser):

```powershell
npm start
# (equivalent) ng serve
```

- Start dev server on a specific port (example 4300):

```powershell
npx ng serve --port 4300
```

- Build the app for production:

```powershell
npm run build
# or explicitly with Angular CLI flags
npx ng build --configuration production
```

- Run unit tests (watch mode, interactive):

```powershell
npm test
```

- Run unit tests once (headless, CI-friendly):

```powershell
npx ng test --watch=false --browsers=ChromeHeadless
# or via npm script
npm test -- --watch=false --browsers=ChromeHeadless
```

- Run unit tests with coverage report:

```powershell
npm test -- --watch=false --browsers=ChromeHeadless --code-coverage
```

- Lint the project (if configured):

```powershell
npx ng lint
# or
npm run lint
```

- Run end-to-end tests (if configured):

```powershell
npx ng e2e
# or
npm run e2e
```

- Stop a running dev server: press Ctrl+C in the terminal where `ng serve` is running.

## Notes & Troubleshooting

- Port already in use: the CLI may prompt to run on a different port. Answer `Y` or `Yes` and the dev server will start on an available port; check the console for the final URL.
- ChromeHeadless missing: If headless runs fail because Chrome isn't found, install Chrome or run `npm test` (interactive) and let the browser open.
- localStorage/getItem error during startup: this repo includes guards in `src/app/auth.service.ts` that check for availability before reading/writing localStorage. If you still see the error, restart the dev server after saving changes.


