# Next Session Plan: Finalizing Frontend

## 1. Feature Completeness Check (Missing Features)

- [ ] **Edit Article Functionality**
    - Currently `NewArticle.jsx` only supports creating.
    - Need to modify it to handle `/editor/:slug` route.
    - Fetch article details if `slug` is present and pre-fill form.
    - Use `PUT /articles/:slug` for updates.

- [ ] **Comments System**
    - `Comment.jsx` exists but needs integration.
    - Need `CommentContainer.jsx`, `CommentList.jsx`, `CommentInput.jsx`.
    - Implement `GET /articles/:slug/comments`.
    - Implement `POST /articles/:slug/comments` (Auth required).
    - Implement `DELETE /articles/:slug/comments/:id` (Author only).

- [ ] **Error Handling & UX**
    - Add global error handling (e.g., Axios interceptor for 401 -> redirect to login).
    - Improve loading states (Skeletons instead of "Loading...").
    - Handle 404 for non-existent articles/profiles.

## 2. Bug & Logic Review

- [ ] **Pagination Reset**: Verify `currentPage` resets on all tab switches (Home & Profile).
- [ ] **Auth Persistence**: Verify `AuthContext` correctly rehydrates user from `localStorage` on refresh.
- [ ] **Form Validation**: Double-check all forms (Login, Register, Settings, Editor) for proper validation messages.
- [ ] **Empty States**: Verify "No articles are here... yet." displays correctly in all feeds.

## 3. Optimization & Best Practices

- [ ] **Code Splitting**: Use `React.lazy` and `Suspense` for route components to improve initial load time.
- [ ] **Component Extraction**:
    - Extract `ArticleList` component (currently duplicated in `Home.jsx` and `Profile.jsx`).
    - Extract `Pagination` component.
- [ ] **Performance**:
    - Check `useQuery` caching policies (staleTime).
    - Optimize re-renders (use `React.memo` for heavy components if needed).
- [ ] **Directory Structure**: Organize components into `common` (Button, Input) vs `features` (Article, Comment).

## 4. Final Verification

- [ ] Run through the entire user flow:
    - Register -> Login -> Update Settings -> Create Article -> Edit Article -> Comment -> Like/Favorite -> Follow User -> Logout.
- [ ] Check responsiveness on mobile view.