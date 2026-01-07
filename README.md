# Mini App Template

A minimal Hardhat + Bun template for developing Solidity smart contracts with TypeScript.

## Quick Start

```bash
bun install
bun run fork:base
bun run test:local
```

## Scripts

- `bun run clean` - Clean build artifacts
- `bun run compile` - Compile contracts
- `bun run test:local` - Run full test suite (clean + compile + deploy + test)
- `bun run deploy:local` - Deploy to localhost
- `bun run deploy:base` - Deploy to Base mainnet
- `bun run upgrade:base` - Upgrade contract on Base
- `bun run fork:base` - Start local node forking Base mainnet
- `bun run tunnel` - Expose local node via ngrok

## Project Structure

```
contracts/          # Solidity contracts
ignition/modules/   # Deployment modules
test/               # Test files
hardhat.config.ts   # Hardhat config
```

## Prerequisites

- Bun (`curl -fsSL https://bun.sh/install | bash`)
- Node.js 18+

## License

MIT
