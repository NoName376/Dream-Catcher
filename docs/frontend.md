# 🌗 Dream Catcher: Frontend Deep Dive

The frontend is a modern, reactive Angular 17+ application built with a focus on "Dreamy Green" aesthetics and state-of-the-art reactivity using **Signals**.

## 🏗️ Architecture Overview

The application follows a **Modular Standalone Architecture**. Every component is standalone, promoting high reusability and reducing circular dependencies.

### Core Technologies
- **Angular 17+**: Utilizing standalone components and the `inject()` function.
- **Signals**: Native state management for high-performance UI updates.
- **Vanilla CSS**: Premium styling with glassmorphism and custom gradients.
- **RxJS**: Stream-based processing for API interactions.

---

## 🧩 Component Registry

### 1. Layout & Shell
- **AppLayout (`app-layout.ts`)**: The primary wrapper for the authenticated experience. Handles sidebar placement and main content routing.
- **Sidebar (`sidebar.ts`)**: Navigation hub. Connects to `AuthService` to show user info and `PostService` for quick action stats.

### 2. Feed System
- **Feed (`feed.ts`)**: Responsive grid/list of dreams. Implements **Infinite Scroll** via `IntersectionObserver`.
- **TrendingHashtags (`trending-hashtags.ts`)**: Sidebar widget fetching the most popular tags from the backend. Triggers search filters on the main feed.
- **DreamFacts (`dream-facts.ts`)**: Specialized educational widget providing "Lucid Insights" to increase user retention.

### 3. Post (Dream) Management
- **PostCard (`post-card.ts`)**: Individual dream display. Uses `livePost()` signal for real-time like/bookmark synchronization.
- **PostCreate (`post-create.ts`)**: Complex form for manifesting dreams. Includes hashtag validation, character counters (5000 limit), and detailed error reporting for network/auth issues.
- **PostModal (`post-modal.ts`)**: Full-screen immersive view for reading long dreams.
- **HashtagSelector (`hashtag-selector.ts`)**: Component for adding/removing tags during dream creation. Limits to 7 tags per post.

### 4. Authentication
- **Login (`login.ts`)**: Reactive form for member access. Connects to `AuthService`.
- **Register (`register.ts`)**: New member onboarding with validation.
- **Auth UI Components**: `AuthHeader`, `AuthField`, `AuthFooter` – reusable atomic components for consistent auth styling.

### 5. Profile & Settings
- **UserProfile (`user-profile.ts`)**: Displays user stats and their personal dream history.
- **Settings (`settings/`)**: Modular settings for account management, including `PasswordChange` and `Security` sub-components.

---

## ⚙️ Services & State Logic

### `PostService`
Primary orchestrator for dream data.
- **Signals**: `posts` (global), `userPosts`, `hasMore`, `currentPage`.
- **Logic**: Handles pagination, hashtag filtering, and real-time state updates (optimistic UI) via `patchPostState`.

### `AuthService`
Manages the user lifecycle.
- **State**: `currentUser` signal.
- **Storage**: Persistent JWT management in `LocalStorage`.
- **Intercept**: Injects tokens via `AuthInterceptor`.

### `NotificationService`
Custom toast system.
- **Methods**: `show(message, type = 'info')`.
- **Implementation**: Uses a signal-based list of active notifications for a smooth UI experience.

---

## 🚦 Navigation & Security
- **AppRoutes**: Defined in `app.routes.ts`. Uses `AuthGuard` to protect private routes.
- **AuthInterceptor**: Automatically appends JTW Bearer tokens to all API requests and handles global 401 redirects.

---

## 💎 Design System: "Dreamy Green"
- **Palette**: A blend of deep emeralds and soft mints.
- **Effects**: `backdrop-filter: blur(10px)` for glassmorphism.
- **Aesthetics**: Heavy use of custom gradients and micro-interactions (hover translations, scale effects).
