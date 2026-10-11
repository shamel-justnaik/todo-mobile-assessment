# React Native To-Do Application

A clean, responsive mobile To-Do application built with **React Native** and **Expo** for the Junior Mobile Developer Technical Assessment.

The application integrates with the simulated [JSONPlaceholder API](https://jsonplaceholder.typicode.com) to fetch and post tasks, providing seamless local state updates, robust error and loading handling, and local persistence across restarts.

---

## 📱 Features

- **Initial Fetching:** Retrieves the first 10 tasks from `GET /todos?_limit=10` on initial launch.
- **Task Completion Toggle:** Tap on any task or checkbox to toggle its completed state locally with strikethrough styling.
- **Task Deletion:** Remove any task locally with an instant update to the list.
- **Add Task (API POST):** Submit a new task to `POST /todos` (`completed: false`, `userId: 1`). Upon a successful API response, the task is immediately prepended to the list without screen reloading.
- **Input Validation:** Prevents submission of empty or whitespace-only titles, providing immediate inline feedback.
- **Loading & Error Handling:**
  - Spinner indicator displayed while fetching tasks.
  - Dedicated error message card with an interactive **Retry** button when network requests fail.
  - Interactive submission state: disables input and Add button while saving with loading indicator.
  - Submit error feedback if task creation fails.
- **Empty State:** Friendly empty state graphic and text when all tasks are deleted.
- **Auto-Capitalization:** Automatically capitalizes the first letter when typing a new task title for a seamless mobile input experience.
- **🌟 Bonus Deliverable (Local Persistence):**
  - Integrated `@react-native-async-storage/async-storage`.
  - All tasks (including additions, toggles, and deletions) persist locally and remain intact when reopening or restarting the application.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** React Native with Expo (SDK 57)
- **Language:** JavaScript (ES6+), React Functional Components & Hooks (`useState`, `useEffect`, `useCallback`)
- **API Requests:** Native `fetch()` API
- **Local Storage:** `@react-native-async-storage/async-storage`
- **UI & Styling:** React Native `StyleSheet` (flexbox layout, cross-platform styling for iOS, Android, and Web)

### Folder Structure
```text
todo-app/
├── App.js                     # Root component, state management & orchestration
├── app.json                   # Expo project configuration
├── package.json
└── src/
    ├── components/
    │   ├── AddTodoForm.js     # Form input, validation, and submission states
    │   ├── EmptyState.js      # Displayed when task list has 0 items
    │   ├── ErrorState.js      # Error banner with retry mechanism
    │   ├── LoadingState.js    # ActivityIndicator spinner with custom text
    │   └── TodoItem.js        # Single task card with checkbox and delete button
    └── services/
        ├── api.js             # API service layer (getTodos, createTodo)
        └── storage.js         # AsyncStorage persistence service
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- `npm` or `yarn`

### Installation
1. Clone this repository:
   ```bash
   git clone <REPO_URL>
   cd todo-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the Expo development server:
```bash
npx expo start
```

You can run the application on multiple platforms:
- **Web Browser (Quickest):** Press `w` in the terminal or run:
  ```bash
  npx expo start --web
  ```
- **Physical Device:** Install the **Expo Go** app from Google Play Store or Apple App Store, then scan the QR code displayed in the terminal.
- **Android Emulator:** Press `a` (requires Android Studio / emulator setup).
- **iOS Simulator:** Press `i` (macOS only).

---

## 🤖 AI Tool Usage Disclosure

In compliance with the assessment guidelines, AI tools (specifically Google DeepMind Antigravity) were utilized during the development of this project for:
1. **Scaffolding & Architecture:** Assisting in structuring clean separation of concerns between API services, local storage helpers, and presentational components.
2. **React Native Component Mapping:** Bridging prior Java/Android Studio knowledge (e.g., mapping `RecyclerView` $\rightarrow$ `FlatList`, `SharedPreferences` $\rightarrow$ `AsyncStorage`).
3. **Syntax & Styling Reference:** Reviewing React Native flexbox layout styling and hook best practices (`useCallback`, `useState`).
4. **Testing & Documentation:** Generating setup instructions and verifying bundle builds.
