# 🧊 Dream Catcher: Backend Architecture

The backend is a robust Python/Django application designed for scale, security, and high performance using **Django REST Framework (DRF)**.

## 🏛️ System Architecture

The project follows the "Fat Models, Slim Views" philosophy, though some complex business logic is encapsulated in **Services** and **Managers**.

### Main Layers
- **Models**: Database schema and data constraints (SQLite in dev, Postgres compatible).
- **Serializers**: Object-relation mapping and data validation logic.
- **Views (ViewSets)**: API interface, query filtering, and social permission logic.
- **Managers**: Custom database query optimization.

---

## 💾 Model Definitions

### 1. `CustomUser`
- Extends `AbstractUser`.
- **Fields**: `email` (primary identifier), `username`, `is_private` (boolean).
- **Logical Impact**: Users marked as `is_private` have their posts hidden from public feeds unless specifically filtered by their username by an authorized requester.

### 2. `Post` (Dream)
- **Fields**: `title`, `content`, `author`, `hashtags` (M2M), `created_at`.
- **Constraints**: Content is optimized for long-form story-telling.
- **Relationships**: Linked to `CustomUser` via ForeignKey.

### 3. `Hashtag`
- **Fields**: `name`, `usage_count`.
- **Logic**: Names are automatically sanitized (trimmed, lowercased). `usage_count` is updated asynchronously after post creation.

### 4. `Like` & `Bookmark`
- Junction tables for social interaction.
- **UniqueConstraint**: Ensures a user cannot like or bookmark a single post multiple times.

---

## 🛰️ ViewSet & Endpoint Logic

### `PostViewSet` (`SocialViews.py`)
The most complex part of the backend. It integrates filtering, annotation, and authorization.

- **Annotations**: Dynamically calculates `likes_count` using Django's `Count` aggregation.
- **Optimization**: Uses `select_related` and `prefetch_related` to solve the N+1 query problem for authors and hashtags.
- **Filtering Logic**:
  - `hashtags`: Filters posts containing specific tag names.
  - `bookmarks`: Restricts query to the authenticated user's saved items.
  - `author_username`: Filters for a specific user's feed.
- **Privacy Shield**: Automatically excludes posts from `is_private` authors in global feeds.
- **Custom Actions**:
  - `POST /api/posts/{id}/like/`: Atomically toggles the like status.
  - `POST /api/posts/{id}/bookmark/`: Atomically toggles the bookmark status.

### `HashtagViewSet`
- **Logic**: Aggregates hashtag usage and returns the Top 10 trending tags for the frontend sidebar.

### Authentication System
- Integrated **JWT** via `djangorestframework-simplejwt`.
- Customs endpoints for Profile retrieval and Password resets.

---

## 🛠️ Internal Services & Managers

- **CustomUserManager**: Handles user creation using email as the primary field.
- **Post Parsing**: Business logic in `perform_create` extracts hashtags from the request and links them to the new post, limiting to 7 tags per dream.

---

## 🔒 Security & Data Integrity
- **CORS Configuration**: Restricts access to allowed origins.
- **Validation**: Strict Drf Serializer validation ensures dream titles and content meet length requirements.
- **Atomic Operations**: Like/Bookmark toggles use `get_or_create` to prevent race conditions.
