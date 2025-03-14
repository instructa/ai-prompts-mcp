# Instructa AI - MCP Prompts API

This repository contains a Model Context Protocol (MCP) implementation for managing and serving AI prompts. The project is built using TypeScript and follows a monorepo structure using pnpm workspaces.

## 🚀 Features

- MCP (Model Context Protocol) implementation
- TypeScript-based architecture
- Monorepo structure using pnpm workspaces
- Environment-based configuration

## 📋 Prerequisites

- Node.js (LTS version recommended)
- pnpm (Package manager)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/instructa-ai.git
cd instructa-ai
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp packages/mcp/.env.dist packages/mcp/.env
# Edit .env file with your configuration
```

## 🏃‍♂️ Development

To start the development server:

```bash
# Start MCP development server
pnpm dev:mcp

# Build MCP package
pnpm build:mcp

# Start MCP production server
pnpm start:mcp
```

## 🏗️ Project Structure

```
.
├── packages/
│   └── mcp/          # MCP implementation package
│       ├── src/      # Source code
│       └── .env      # Environment configuration
├── package.json      # Root package.json
└── pnpm-workspace.yaml
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 🌐 Social

- X/Twitter: [@kregenrek](https://x.com/kregenrek)
- Bluesky: [@kevinkern.dev](https://bsky.app/profile/kevinkern.dev)

## 📝 License

[MIT License](https://github.com/instructa/ai-prompts/blob/main/LICENSE)

This repository is open-source under the MIT license. You're free to use, modify, and distribute it under those terms. Enjoy building!
