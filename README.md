# VibeHub 🌐✨

VibeHub is a modern social media web application that allows users to share posts, interact with others, and manage their personal profiles in a smooth and responsive experience.

The project focuses on clean UI, proper authentication flow, protected routes, and scalable state management using Redux Toolkit.

---

## 🚀 Features

### 🔐 Authentication

- User Registration & Login
- JWT-based authentication
- Protected routes (Home/Feed & Profile accessible only when logged in)
- Logout functionality

### 🏠 Home / Feed

- Create posts with text and optional images
- View posts in a clean, responsive feed
- Edit and delete posts (owner only)

### 💬 Comments

- Add comments to posts
- Edit and delete comments (owner only)

### 👤 Profile

- Personal profile page
- View user's own posts
- Upload and update profile photo

### ⚙️ Settings

- Change password securely

### 🧭 Navigation

- Responsive Navbar (mobile & desktop)
- User avatar and username displayed
- Conditional rendering based on authentication state

### 🧠 State Management

- Redux Toolkit for global state management
- Separate slices for authentication, profile, and posts

### 🔔 UX Enhancements

- Toast notifications for success & error messages
- Loading states
- Custom Error & Not Found pages
- Fully responsive design

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router)
- **UI Library:** Material UI (MUI)
- **State Management:** Redux Toolkit
- **HTTP Client:** Axios
- **Authentication:** JWT
- **Styling:** Responsive Design (Mobile & Desktop)
- **Notifications:** Toast messages

---

## 📂 Project Structure (Simplified)

src/
│── app/
│ │── \_components/
│ │ ├── CommentItem/
│ │ ├── CreatePost/
│ │ ├── footer/
│ │ ├── navbar/
│ │ ├── Post/
│ │ └── ProfilePhoto/
│ │
│ │── (pages)/
│ │ ├── feed/
│ │ ├── profile/
│ │ ├── register/
│ │ ├── settings/
│ │ └── singlePost/
│ │
│ │── error.tsx
│ │── loading.tsx
│ │── layout.tsx
│
│── interfaces/
│ ├── podtData.ts
│
│── lib/
│ ├── store.ts
│ ├── authSlice.ts
│ ├── profileSlice.ts
│ ├── postsSlice.ts
│ └── commentsSlice.ts
│
│── styles/
│ └── globals.css
│
public/
│── images/

---

## 🔒 Protected Routes Logic

- Users must be authenticated to access:
  - Home / Feed
  - Profile
  - Settings
- Authentication is handled using JWT stored securely.
- UI updates dynamically based on login state.

---

## 📱 Responsive Design

- Fully responsive layout
- Optimized for:
  - Mobile
  - Tablet
  - Desktop
- Adaptive Navbar with mobile menu support

---

## 👩‍💻 Author

**Menna Omar**  
Frontend Developer  
React | Next.js | Redux Toolkit

---

## ⭐ Acknowledgments

Thanks to all the open-source tools and libraries that made this project possible.

If you like the project, feel free to ⭐ the repository!
