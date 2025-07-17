# GitHub Actions CI/CD Setup for AutoVal

This document describes the GitHub Actions workflows configured for the AutoVal project.

## Overview

The AutoVal project uses a comprehensive CI/CD pipeline with the following workflows:

### 1. Main CI/CD Pipeline (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
- **Frontend Testing**: Runs on Node.js 18.x and 20.x
- **Backend Testing**: Runs on Python 3.9, 3.10, and 3.11
- **Integration Testing**: Full end-to-end testing
- **Security Scanning**: npm audit and Python safety checks
- **Deployment**: Automatic deployment to staging (develop) and production (main)

### 2. Code Quality (`code-quality.yml`)

**Features:**
- ESLint for JavaScript/TypeScript
- TypeScript type checking
- Python code formatting (Black)
- Code style checking (Flake8)
- Import sorting (isort)
- Security scanning (Bandit)
- Type checking (MyPy)
- Basic performance testing

### 3. Dependency Updates (`dependency-updates.yml`)

**Schedule:** Every Monday at 9 AM UTC

**Features:**
- Automatic npm dependency updates
- Python dependency updates
- Security vulnerability fixes
- Automated pull request creation

### 4. Release Management (`release.yml`)

**Triggers:**
- Git tags starting with 'v'
- Manual workflow dispatch

**Features:**
- Full test suite execution
- Application building
- Changelog generation
- GitHub release creation
- Docker image building and publishing

## Setup Instructions

### 1. Required Secrets

Add the following secrets to your GitHub repository settings:

```
DOCKER_USERNAME         # Docker Hub username
DOCKER_PASSWORD         # Docker Hub password or access token
CODECOV_TOKEN          # Codecov.io token (optional)
```

### 2. Branch Protection

Configure branch protection rules for `main` and `develop`:

1. Go to Settings → Branches
2. Add rule for `main`:
   - Require status checks to pass before merging
   - Require branches to be up to date before merging
   - Required status checks:
     - `test-frontend`
     - `test-backend`
     - `integration-test`
     - `security-scan`
3. Repeat for `develop` branch

### 3. Environment Configuration

Create the following environments in your repository:

**Staging Environment:**
- Branch: `develop`
- Add environment-specific variables as needed

**Production Environment:**
- Branch: `main`
- Add environment-specific variables as needed
- Enable required reviewers

### 4. Codecov Integration (Optional)

1. Sign up at [codecov.io](https://codecov.io)
2. Connect your repository
3. Add `CODECOV_TOKEN` to repository secrets
4. Coverage reports will be automatically uploaded

## Workflow Features

### Matrix Testing

Both frontend and backend are tested across multiple versions:
- **Node.js**: 18.x, 20.x
- **Python**: 3.9, 3.10, 3.11

### Caching

The workflows use aggressive caching to speed up builds:
- npm dependencies cached by package-lock.json
- pip dependencies cached by requirements.txt
- Node.js and Python versions cached

### Error Handling

- Most quality checks use `continue-on-error: true` to not block deployments
- Security scans are informational and don't fail the build
- Comprehensive error reporting with artifacts

### Performance Monitoring

- Basic performance tests included
- Response time monitoring
- Build time tracking

## Docker Integration

### Building Images

```bash
# Build development image
docker-compose up --build

# Build production image
docker build -t autoval:latest .

# Run tests in Docker
docker-compose run test
```

### Docker Hub

Images are automatically built and pushed to Docker Hub on releases:
- `username/autoval:latest` (latest release)
- `username/autoval:v1.0.0` (specific version)

## Local Development

### Running Tests Locally

```bash
# Install dependencies
npm ci
cd backend && pip install -r requirements.txt

# Run all tests
python run_tests.py

# Run specific test suites
npm test                    # Frontend tests
npm run test:coverage       # Frontend with coverage
cd backend && pytest -v    # Backend tests
```

### Code Quality Checks

```bash
# Frontend
npm run lint
npx tsc --noEmit

# Backend
cd backend
black --check .
flake8 .
isort --check-only .
mypy . --ignore-missing-imports
```

## Troubleshooting

### Common Issues

1. **Tests failing locally but passing in CI**
   - Check Node.js/Python versions
   - Verify environment variables
   - Clear caches: `npm ci` and `pip install --force-reinstall`

2. **Docker build failures**
   - Check .dockerignore file
   - Verify multi-stage build targets
   - Ensure all required files are copied

3. **Deployment failures**
   - Check environment secrets
   - Verify branch protection rules
   - Ensure build artifacts are available

### Debug Commands

```bash
# Check workflow logs
gh run list
gh run view [run-id]

# Debug Docker build
docker build --no-cache -t autoval:debug .
docker run -it autoval:debug /bin/bash

# Test GitHub Actions locally (using act)
act -j test-frontend
act -j test-backend
```

## Best Practices

1. **Always run tests locally** before pushing
2. **Use feature branches** for development
3. **Keep dependencies updated** via automated PRs
4. **Monitor security scans** regularly
5. **Review deployment logs** after releases
6. **Test Docker builds** before major releases

## Contributing

When contributing to the project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass locally
5. Submit a pull request
6. Wait for CI checks to pass
7. Request review from maintainers

The CI/CD pipeline will automatically run all tests and quality checks on your pull request.
