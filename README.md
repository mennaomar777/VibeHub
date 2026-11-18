# VibeHub

VibeHub is a responsive social networking app built with Next.js. Users can publish posts, interact with posts and comments, follow other members, and manage their profile.

## Features

- Register, sign in, and sign out with JWT-based authentication.
- Browse the feed, community posts, your own posts, and saved posts.
- Create, edit, delete, like, bookmark, and share posts.
- Comment on posts, reply to comments, and like, edit, or delete comments.
- View member profiles, follow or unfollow users, and browse follow suggestions.
- View notifications, filter all or unread notifications, mark notifications as read, and load additional notifications.
- Change your password from Settings.
- **Dark Mode and Light Mode with theme switching.**
- Responsive navigation, loading states, error feedback, and empty states.

## Tech stack

- Next.js App Router and React
- TypeScript
- Material UI
- Redux Toolkit and React Redux
- Axios
- Formik and Yup

## Requirements

- Node.js and npm
- Access to the Route Posts API (`https://route-posts.routemisr.com`)

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other available scripts:

```bash
npm run build
npm start
npm run lint
```

Sign-in and registration save a JWT for authenticated API requests and mirror it to a cookie for page routing. The Next.js proxy redirects guests away from app pages and signed-in users away from the sign-in and registration pages. A client-side route guard checks the session before rendering protected pages.

## Project structure

```text
proxy.ts
src/
├── app/
│   ├── (pages)/
│   │   ├── feed/
│   │   ├── notifications/
│   │   ├── profile/[id]/
│   │   ├── register/
│   │   ├── settings/
│   │   └── singlePost/[id]/
│   ├── _components/
│   │   ├── CommentItem/
│   │   ├── CreatePost/
│   │   ├── Post/
│   │   ├── ProfilePhoto/
│   │   ├── SideBar/
│   │   ├── SuggestedFriends/
│   │   ├── ColorModeProvider.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── RouteGuard.tsx
│   │   ├── footer/
│   │   └── navbar/
│   ├── interfaces/
│   ├── error.tsx
│   ├── globals.css
│   ├── icon.svg
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── page.module.css
└── lib/
    ├── authSlice.tsx
    ├── commentsSlice.ts
    ├── notificationSlice.ts
    ├── postSlice.ts
    ├── profileSlice.ts
    ├── store.tsx
    └── useUserPosts.ts
```

## Authentication and API

The app uses the Route Posts API at `https://route-posts.routemisr.com`. Sign-in and registration return a JWT, which the client sends as a bearer token for authenticated API requests. The proxy checks the token cookie and its expiration for page redirects; the client route guard also prevents protected page content from rendering without a locally stored token. The home page (`/`) is the sign-in page, and `/register` is the registration page.

## Author

Menna Omar — Frontend Developer
