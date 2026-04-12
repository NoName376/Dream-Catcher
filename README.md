# Dream Catcher 💤

Dream Catcher is a modern, high-performance Social Networking application built with **Angular 19** and **Django REST Framework**. It is designed with a premium "Dreamy Green" aesthetic and utilizes cutting-edge architectural patterns for scalability and efficiency.

## 🚀 Key Features

- **Dynamic Feed**: A performant dream stream utilizing Angular's new `@defer` blocks for optimized viewport rendering.
- **Advanced Hashtag System**: Mechanical hashtag selection with a limit of 7 tags per post and trending suggestions.
- **Social Interactions**: Real-time liking and bookmarking (saving) of dreams.
- **Global Search**: Filter the entire dreamscape by hashtags.
- **Secure Identity**: Comprehensive user profile management and a secure password change system requiring verification of the previous password.
- **Responsive Sidebar**: desktop-first navigation with glassmorphism effects and modern UX.

## 🛠 Technology Stack

### Backend (Django)
- **Django REST Framework**: Class-based views and ModelSerializers.
- **JWT Authentication**: Secure token-based access via `simplejwt`.
- **Custom User Management**: Specialized `CustomUserManager` for email-based authentication.
- **Relational Integrity**: Scalable model architecture for Posts, Hashtags, Likes, and Bookmarks.

### Frontend (Angular)
- **Signals System**: Full state management and reactivity using `signal`, `computed`, and `effect`.
- **Modern DI**: Heavy utilization of the `inject()` function for clean, constructor-less dependency injection.
- **Partial Hydration**: Leveraging `@deferrable views` to optimize Web Vitals and LCP.
- **Reactive Forms**: Robust validation and error handling for all user inputs.
- **Standalone Components**: Modular architecture for maximum maintainability.

## 📂 Project Structure

### Backend (`/backend`)
- `api/models.py`: Core entities (User, Post, Hashtag, Like, Bookmark).
- `api/views/`: Categorized views for Authentication and Social actions.
- `api/serializers/`: Data transformation layer for efficient API communication.
- `api/services/`: Business logic decoupled from views.

### Frontend (`/frontend`)
- `src/app/components/`: Modular component library (Decomposed into `.ts`, `.html`, `.css`).
- `src/app/services/`: Injectable services for Auth, Posts, and Social operations.
- `src/app/interfaces/`: Strict TypeScript definitions for all data structures.
- `src/app/guards/`: Functional route protection.
- `src/app/interceptors/`: centralized JWT handling.

## 📖 API Documentation (Simplified)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register/` | POST | Create a new user and receive tokens |
| `/api/auth/login/` | POST | Authenticate and receive JWT tokens |
| `/api/auth/password/` | POST | Secure password update (requires old password) |
| `/api/posts/` | GET | List posts (filters: `hashtags`, `bookmarks`) |
| `/api/posts/` | POST | Create a new dream with hashtags |
| `/api/posts/{id}/like/` | POST | Toggle like status |
| `/api/hashtags/` | GET | Retrieve trending hashtags |

## 🛠 Getting Started

### Backend Setup
1. Create a virtual environment: `python -m venv venv`
2. Install dependencies: `pip install django djangorestframework djangorestframework-simplejwt django-cors-headers`
3. Apply migrations: `python manage.py migrate`
4. Start server: `python manage.py run_server`

### Frontend Setup
1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Access at: `http://localhost:4200`

## 🎨 Design System

The application utilizes a custom CSS variables system based on the **Dreamy Green** palette:
- **Primary**: `#a8e6cf` (Mint)
- **Secondary**: `#56ab2f` (Deep Green)
- **Background**: `#0f1715` (Nightshade)
- **Accents**: Glassmorphism effects with `backdrop-filter: blur(20px)`.