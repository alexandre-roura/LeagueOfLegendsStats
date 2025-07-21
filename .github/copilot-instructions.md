# League of Legends Stats App - AI Coding Guide

## Architecture Overview

This is a **full-stack League of Legends statistics application** with a FastAPI backend and React/TypeScript frontend. The app displays player stats, match history, and detailed match information with support for both traditional 5v5 and Arena game modes.

### Key Components

- **Backend**: FastAPI with Pydantic models, handles Riot Games API integration
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Data Flow**: Frontend fetches from local API → Backend proxies to Riot Games API

## Development Workflow

### Starting the Application

```bash
# Backend (from /backend)
uvicorn main:app --reload

# Frontend (from /frontend)
npm run dev
# OR use VS Code task: "Start Frontend Dev Server"
```

### Key File Patterns

#### Backend Structure

- `main.py`: FastAPI app entry point with CORS setup
- `app/routes.py`: API endpoints that mirror Riot Games API structure
- `app/api.py`: `RiotApiClient` class with rate limiting and region mapping
- `app/models.py`: Pydantic models that exactly match Riot API responses
- `app/exceptions.py`: Custom exception hierarchy for API error handling

#### Frontend Structure

- `src/components/`: UI components with match-specific components in `/match/` subdirectory
- `src/hooks/`: Custom hooks for data fetching and image URL generation
- `src/types/`: TypeScript interfaces matching backend Pydantic models
- `src/utils/`: Utilities for game constants, time formatting, and version handling

## Critical Patterns & Conventions

### Data Dragon Integration

**Always use dynamic game versions** from `utils/gameVersion.ts`:

```typescript
// ✅ Correct - Dynamic version fetching
const gameVersion = getFormattedGameVersion(matchData?.info.gameVersion);
const { getChampionImageUrl } = useChampionImageUrl(gameVersion);

// ❌ Avoid - Hard-coded versions
const url = `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${name}.png`;
```

### Champion Name Formatting

Use `useChampionImageUrl` hook which handles special cases:

```typescript
// Handles: "Nunu & Willump" → "Nunu", "Cho'Gath" → "Chogath", etc.
const { getChampionImageUrl } = useChampionImageUrl(gameVersion);
```

### Match Display Patterns

- **Arena Mode (queueId: 1700)**: Group by `placement`, show top 4 teams
- **5v5 Modes**: Group by `teamId` (100 vs 200)
- **Current Player Highlighting**: Always check `puuid === currentPlayerPuuid`

### Component Architecture

Match-related components follow a **modular pattern**:

- `MatchCard.tsx`: Main orchestrator using `useMatchData` hook
- `/match/` subcomponents: Each handles specific display logic
- Custom hooks encapsulate API calls and complex logic

### API Error Handling

Backend uses **custom exception hierarchy**:

```python
# Specific exceptions for different API scenarios
RiotApiException, AccountNotFoundException, RateLimitException, ApiKeyException
```

Frontend expects **standardized response format**:

```typescript
interface ApiResponse {
  success: boolean;
  data: any;
}
```

### Region & Queue ID Mapping

- **Regions**: Use `platform_endpoints` mapping in `api.py`
- **Queue Types**: Reference `QUEUE_MAPPINGS` in `gameConstants.ts`
- **Special Modes**: Arena (1700), ARAM (450), Ranked Solo (420), Ranked Flex (440)

### Styling Conventions

- **Win/Loss Colors**: Green gradients for wins, red for losses
- **Current Player**: Blue highlighting (`text-blue-400`, `border-blue-400`)
- **LoL Gold**: Custom color `text-lol-gold` defined in Tailwind config
- **Responsive Design**: Mobile-first with `md:` breakpoints

### Environment Configuration

```bash
# Backend .env
RIOT_API_KEY=your_api_key_here

# Frontend .env (optional)
VITE_API_BASE_URL=http://localhost:8000
```

## Code Quality & Architecture Guidelines

### **ALWAYS maintain clean architecture** following best practices for FastAPI and React development.

### Backend Best Practices (FastAPI)

#### Mandatory Principles

- **Separation of Concerns**: Keep routes, business logic, and data access separate
- **Dependency Injection**: Use FastAPI's dependency system for shared resources
- **Type Safety**: Always use Pydantic models for request/response validation
- **Error Handling**: Use custom exceptions with proper HTTP status codes
- **Async/Await**: Prefer async functions for I/O operations

#### Recommended Refactoring Opportunities

- **Extract business logic** from routes into service classes
- **Create repository pattern** for data access abstraction
- **Add input validation** with Pydantic Field validators
- **Implement caching** for frequently accessed data (Redis recommended)

#### Suggested Libraries for Improvements

```python
# Consider adding these dependencies:
sqlalchemy[asyncio]>=2.0.0    # If adding database persistence
redis>=4.5.0                  # For caching Riot API responses
python-jose[cryptography]     # For JWT authentication if needed
slowapi                       # Rate limiting middleware
prometheus-client             # Metrics and monitoring
structlog                     # Better structured logging
```

### Frontend Best Practices (React/TypeScript)

#### Mandatory Principles

- **Custom Hooks**: Extract complex logic into reusable hooks
- **Component Composition**: Prefer composition over inheritance
- **TypeScript Strict Mode**: Use strict typing, avoid `any`
- **Error Boundaries**: Implement proper error handling
- **Performance**: Use React.memo, useMemo, useCallback when appropriate

#### Recommended Refactoring Opportunities

- **Extract context providers** for shared state management
- **Create generic components** for reusable UI patterns
- **Implement proper loading states** with skeleton components
- **Add form validation** with schema-based validation
- **Optimize bundle size** with code splitting

#### Suggested Libraries for Improvements

```bash
# Consider adding these packages:
npm install @tanstack/react-query    # Server state management & caching
npm install zod                      # Runtime schema validation
npm install react-hook-form          # Performant form handling
npm install framer-motion            # Smooth animations
npm install @headlessui/react        # Accessible UI components
npm install clsx                     # Conditional className utility
npm install react-error-boundary     # Error boundary components
npm install @tanstack/react-virtual  # Virtual scrolling for large lists
```

### Refactoring Guidelines

**When you see refactoring opportunities:**

1. **Extract repeated patterns** into reusable utilities
2. **Split large components** into smaller, focused pieces
3. **Move side effects** into custom hooks
4. **Abstract API calls** behind service layers
5. **Optimize data structures** for better performance
6. **Add proper error handling** at component boundaries

**Always prioritize:**

- **Code readability** over cleverness
- **Type safety** over runtime checks
- **Testability** through dependency injection
- **Maintainability** through clear separation of concerns

## Testing & Debugging

### Common Issues

- **Champion Images**: Use `useChampionImageUrl` hook for name formatting edge cases
- **Game Versions**: Always fetch dynamically, never hardcode Data Dragon versions
- **Arena Mode**: Check `queueId === 1700` and use `placement` field
- **CORS**: Backend configured for localhost:5173 (Vite) and localhost:3000 (React)

### API Endpoints

- Player info: `GET /player/{name}/{tag}?region={region}`
- Match history: `GET /matches/by-puuid/{puuid}/ids?region={region}`
- Match details: `GET /matches/{matchId}?region={region}`

Access API docs at `http://localhost:8000/docs` when backend is running.

## Git Workflow & Version Control

### Commit Message Conventions

Follow **Conventional Commits** format for clear project history:

```bash
# Format: <type>(<scope>): <description>
# Types: feat, fix, docs, style, refactor, test, chore

# ✅ Good examples:
feat(frontend): add React Router navigation with SPA structure
fix(backend): resolve rate limiting issue in RiotApiClient
docs(readme): update installation instructions
refactor(components): extract MatchCard into smaller components
style(layout): improve responsive design for mobile devices
test(api): add unit tests for player service endpoints
chore(deps): update React and TypeScript to latest versions

# ✅ Breaking changes:
feat(api)!: change player endpoint to use name-tag format
```

### Pre-Commit Checklist

**Always verify before committing:**

```bash
# 1. Run linting and type checking
npm run lint          # Frontend linting
npm run type-check    # TypeScript validation

# 2. Test both environments
npm run dev           # Frontend development server
uvicorn main:app --reload  # Backend server

# 3. Check for common issues
- No console.log() in production code
- No hardcoded API keys or sensitive data
- All imports properly typed
- Error handling implemented
- Responsive design tested
```

### Git Commands Workflow

```bash
# 1. Check current status and changes
git status
git diff

# 2. Add changes selectively
git add src/components/NewComponent.tsx
git add backend/app/new_feature.py
# OR add all changes: git add .

# 3. Commit with descriptive message
git commit -m "feat(components): add PlayerStats component with match history"

# 4. Push to remote repository
git push origin main
# OR for new branch: git push -u origin feature/new-feature

# 5. For feature branches
git checkout -b feature/arena-mode-support
git commit -m "feat(arena): add Arena game mode support"
git push -u origin feature/arena-mode-support
```

### Branch Management

```bash
# ✅ Recommended workflow:
main branch          → Production-ready code
feature/feature-name → New feature development
fix/bug-description  → Bug fixes
docs/update-name     → Documentation updates

# Create and switch to feature branch
git checkout -b feature/leaderboards-page
git commit -m "feat(pages): implement leaderboards with ranking system"
git push -u origin feature/leaderboards-page

# Merge back to main (after code review)
git checkout main
git merge feature/leaderboards-page
git push origin main
```

### Code Review Guidelines

**Before pushing major changes:**

1. **Self-review**: Check diff for unintended changes
2. **Test locally**: Ensure both frontend and backend work
3. **Update documentation**: If APIs or components change
4. **Consider breaking changes**: Update version if needed

```bash
# Good practice: Review your own changes first
git diff --staged
git log --oneline -5  # Check recent commits
```

### Emergency Fixes

```bash
# For critical production fixes:
git checkout main
git checkout -b hotfix/critical-bug-fix
# Make minimal changes
git commit -m "fix(api): resolve player data loading issue"
git push -u origin hotfix/critical-bug-fix
# Merge immediately after testing
```
