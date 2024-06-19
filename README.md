# Express.js Next.js Turborepo Boilerplate

This is a basic Turborepo setup for a Next.js app with Express.js server, using TypeScript.

## Running the app

Run the following command to start the apps:

```
pnpm install
pnpm dev
```

## What's inside?

This boilerplate includes following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `server`: an [Express.js](https://expressjs.com/) app
- `@packages/emails`: a React email component library to be used in the server app.
- `@packages/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@packages/tsconfig`: `tsconfig.json`s used throughout the monorepo
- `@packages/shared`: Shared types and utilities between the server and web apps

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This boilerplate has some additional tools already setup for you:

- [Upstash Redis](https://upstash.com/) for Redis caching
- [Lucia Auth](https://lucia-auth.com/) for authentication
- [Drizzle ORM](https://orm.drizzle.team/) for database access
- [Shadcn UI](https://shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- Basic users table for the server app
- Basic auth for the server app & web app
- Basic access control for the server app
- Multi-language support for the server app & web app
- Server versioning (folder based)

as well as:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io/) for code formatting
- [Turborepo](https://turbo.build/repo/) for monorepo management

### Build

To build all apps and packages, run the following command:

```
pnpm build
```
