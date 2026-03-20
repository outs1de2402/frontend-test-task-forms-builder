# Google Forms Lite Clone

A monorepo test-task project with:

- `client`: React + TypeScript + Redux Toolkit + RTK Query
- `server`: Node.js + Apollo GraphQL + in-memory storage

## Project structure

```text
.
├── client/
├── server/
└── package.json
```

## Requirements

- Node.js 20+
- npm 10+

## Installation

Install all workspace dependencies from the repository root:

```bash
npm install
```

## Development

Run both apps together:

```bash
npm run dev
```

This starts:

- client at `http://localhost:5173`
- GraphQL server at `http://localhost:4000/graphql`

You can also run workspaces separately:

```bash
npm run dev -w server
npm run dev -w client
```

## GraphQL code generation

The client uses generated GraphQL types and RTK Query hooks.

```bash
npm run generate
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Features

- Create forms with text, date, multiple choice, and checkbox questions.
- Browse all created forms from the homepage.
- Open a public form page and submit responses.
- Review all responses grouped by form.
- Uses an in-memory store on the server, so data resets after a restart.
