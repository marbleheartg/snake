# Contributing

## Setup

1. Fork and clone the repository
2. Install dependencies: `bun install`
3. Create a branch: `git checkout -b feature/your-feature-name`

## Development

### Running Tests

```bash
bun run test:local  # Full test suite
bun run compile     # Compile contracts
bun run deploy:local # Deploy to localhost
```

### Making Changes

- **Contracts**: Add to `contracts/`
- **Tests**: Add to `test/`
- **Deployment**: Update `ignition/modules/` if needed

### Code Style

- Use TypeScript for scripts/tests
- Follow Solidity style guide
- Write clear commit messages

## Submitting Changes

1. Ensure tests pass: `bun run test:local`
2. Commit with clear messages (e.g., `feat: add new contract`)
3. Push and create a PR with a clear description

**PR Guidelines:**

- Keep PRs focused and reasonably sized
- Include tests for new functionality
- Update documentation as needed

By contributing, you agree to license your contributions under the MIT License.
