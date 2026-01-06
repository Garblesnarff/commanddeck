# CommandDeck

A tactical observability platform for real-time system monitoring and visualization.

## Monorepo Structure

```
commanddeck/
├── packages/
│   ├── landing/     # Marketing landing page
│   └── app/         # Interactive visualization tool
├── package.json     # Root workspace config
└── README.md
```

## Getting Started

**Prerequisites:** [Bun](https://bun.sh)

Install all dependencies from the root:

```bash
bun install
```

## Packages

### Landing Page

```bash
cd packages/landing
bun run dev
```

The tactical landing page showcasing CommandDeck features.

### App

```bash
cd packages/app
bun run dev
```

The interactive visualization tool with real-time unit control.

## Development

This monorepo uses Bun workspaces. All packages can be installed from the root directory.
