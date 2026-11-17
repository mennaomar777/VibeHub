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

The app sends authenticated API requests with the bearer token saved by the sign-in flow.

## Project structure

```text
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
│   │   ├── footer/
│   │   └── navbar/
│   ├── interfaces/
│   ├── error.tsx
│   ├── icon.svg
│   ├── layout.tsx
│   └── loading.tsx
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

The app uses the Route Posts API. Sign-in provides a bearer token, which the client uses for authenticated requests. Protected views rely on the signed-in user session.

## Author

Menna Omar — Frontend Developer
