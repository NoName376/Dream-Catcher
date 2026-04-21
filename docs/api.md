# 🔌 Dream Catcher: API Interface & Interaction

This document specifies the exact communication protocols between the Frontend (Angular) and Backend (Django).

## 🔑 Authentication Flow

All authentication endpoints are located under `/api/auth/`.

### 1. Registration
- **Endpoint**: `POST /api/auth/register/`
- **Request Body**:
  ```json
  {
    "username": "...",
    "email": "...",
    "password": "..."
  }
  ```

### 2. Login
- **Endpoint**: `POST /api/auth/login/`
- **Response Body**:
  ```json
  {
    "access": "jwt_access_token",
    "refresh": "jwt_refresh_token",
    "user": { ... }
  }
  ```
- **Action**: Frontend stores `access` token in `LocalStorage` and prefixes all requests with `Authorization: Bearer <token>`.

---

## ☁️ Dreams (Posts) API

### List Dreams
- **Endpoint**: `GET /api/posts/`
- **Query Parameters**:
  - `page`: Page number (e.g., `1`).
  - `sort`: `newest` (default) or `popular`.
  - `hashtags`: List of strings (e.g., `?hashtags=lucid&hashtags=fly`).
  - `author_username`: Filter for specific user.
  - `bookmarks`: `true` to fetch user's saved posts.
- **Example Response**:
  ```json
  {
    "count": 120,
    "next": "...",
    "previous": null,
    "results": [
      {
        "id": 1,
        "author_username": "dreamer",
        "title": "Cloud Journey",
        "content": "I was flying above the clouds...",
        "hashtag_names": ["flying", "soft"],
        "likes_count": 25,
        "is_liked": true,
        "is_bookmarked": false
      }
    ]
  }
  ```

### Manifest a Dream (Create)
- **Endpoint**: `POST /api/posts/`
- **Notes**: Backend automatically limits to the first 7 hashtags provided in `hashtag_names`.

### Social Toggles
- **Like**: `POST /api/posts/{id}/like/` -> Returns `{"status": "liked"}` or `{"status": "unliked"}`.
- **Bookmark**: `POST /api/posts/{id}/bookmark/` -> Returns `{"status": "saved"}` or `{"status": "unsaved"}`.

---

## 🏷️ Hashtags API

### Trending Tags
- **Endpoint**: `GET /api/hashtags/`
- **Ordering**: Returns Top 10 hashtags sorted by `usage_count` descending.

---

## 🛠️ Data Synchronization & Reactivity

### Optimistic Updates
When a user clicks "Like" in the UI:
1. Frontend immediately updates the local Signal (Optimistic UI).
2. Frontend sends the `POST` request to the API.
3. If the request fails, the Frontend reverts the Signal to its previous state and shows a `Notification`.

### Signal Bridge
The `PostService` acts as the bridge. It transforms backend snake_case keys into frontend-friendly objects and maintains a readonly signal of current posts that all components subscribe to.

---

## ⚠️ Error Responses

| Code | Meaning | Context |
|---|---|---|
| `400` | Validation Failure | Hashtag count exceeded or missing fields. |
| `401` | Token Expired | User redirected to login. |
| `403` | Private Content | Attempt to view a private profile without permissions. |
| `429` | Rate Limit | Too many dreams manifested in a short period. |
| `500` | Database Error | Server-side collision or migration issue. |
