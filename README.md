# Dream Catcher - Social Network

A modern social network designed to capture and share dreams. Built with Angular 17+ and Django REST Framework.

## Features

- **Dream Feed**: Infinite scrolling feed of dreams from the collective unconscious.
- **Dream Casting**: Create posts with up to 5000 characters and up to 7 hashtags.
- **Social Interactions**: Like and bookmark dreams to preserve them in your personal collection.
- **Trending Hashtags**: Real-time view of popular dream themes.
- **User Profiles**: View personal dreams and manage settings.
- **Secure Authentication**: JWT-based session management with persistent login.

## Architecture

The project is divided into two main parts:
- `frontend/`: Angular 17+ application using Signals for state management and `inject()` for dependency injection.
- `backend/`: Django application providing a REST API via Django REST Framework.

### Frontend Technical Stack
- **Framework**: Angular 17+ (Standalone Components)
- **State Management**: Angular Signals
- **Authentication**: JWT (Stored in LocalStorage)
- **Styling**: Vanilla CSS with modern aesthetics (Glassmorphism, Gradients)
- **Icons**: Emoji-based for a lightweight and dreamy feel

## Installation & Setup

### Frontend
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   ng serve
   ```
4. Access the app at `http://localhost:4200`.

### Backend
1. Navigate to the `backend/` directory.
2. Initialize and run the Django server (ensure you have the necessary environment setup).

## Project Structure (Frontend)

- `src/app/components/`: Modular UI components (Feed, Profile, Post Cards, etc.)
- `src/app/services/`: Core business logic and API interaction (Auth, Post, Social)
- `src/app/interfaces/`: TypeScript definitions for data models
- `src/app/guards/`: Navigation protection
- `src/app/interceptors/`: HTTP request transformation (Auth headers)

## Design System

The application uses a **"Dreamy Green"** palette:
- Primary Color: `#a8e6cf` / `#56ab2f`
- Background: Dark, atmospheric tones with blur effects
- Typography: Clean, high-readability fonts

## Interaction Rules
- **Hashtag Limit**: Maximum 7 tags per post.
- **Content Limit**: Up to 5000 characters per dream.
- **Private Bookmarks**: Saved dreams are only visible to you in your bookmarks tab.