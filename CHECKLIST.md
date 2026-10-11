# Assessment Verification Checklist

Use this checklist to manually test and verify every single requirement from the assessment specification.

---

## 1. Functional Requirements

### 📥 1.1 Initial Fetch & Display
- [ ] **Fetch First 10 Tasks:** On initial load, app calls `GET https://jsonplaceholder.typicode.com/todos?_limit=10`.
- [ ] **Title Display:** Each item displays its task title clearly.
- [ ] **Completion Status:** Items with `completed: true` show a visual indicator (checked box + strikethrough text); incomplete items show an open checkbox.
- [ ] **Task Counter:** Header displays the total number of tasks and completed count.

---

### 🔄 1.2 Local Toggle Completion
- [ ] **Toggle to Completed:** Clicking an unchecked task marks it as completed (checkmark appears, text struck through).
- [ ] **Toggle to Incomplete:** Clicking a completed task unchecks it and restores normal text styling.
- [ ] **Local State Only:** The toggle is immediate and does not trigger an unnecessary full-screen reload.

---

### ➕ 1.3 Add Task (API POST)
- [ ] **POST Request:** Submitting a task sends a request to `POST https://jsonplaceholder.typicode.com/todos` with `{ title, completed: false, userId: 1 }`.
- [ ] **Immediate UI Update:** Upon successful response, the new task appears at the top of the list **without** refreshing/reloading the screen.
- [ ] **Clear Input:** The text input resets to empty after successful addition.

---

### 🛡️ 1.4 Form Validation & Error Handling
- [ ] **Reject Empty Input:** Submitting with an empty input shows a validation error message (`"Task title cannot be empty."`).
- [ ] **Reject Whitespace-Only:** Typing only spaces (e.g., `"   "`) and submitting is blocked with an error.
- [ ] **Disabled State While Saving:** The "Add" button and input field are disabled while the POST request is in flight.
- [ ] **Saving Spinner:** The button displays a loading spinner during submission.
- [ ] **Submit Failure Notice:** Displays an inline error message if task addition fails.

---

### 🗑️ 1.5 Local Deletion
- [ ] **Delete Single Task:** Clicking the `✕` delete button removes that specific item from the list.
- [ ] **Immediate Update:** The item disappears immediately from the UI without a page reload.

---

### ⏳ 1.6 Loading, Error & Empty States
- [ ] **Loading Indicator:** An `ActivityIndicator` spinner and "Fetching tasks..." text appears while data is loading.
- [ ] **Empty State:** After deleting all tasks, a friendly "No tasks left" empty state screen is displayed.
- [ ] **Error State with Retry:** If the initial network request fails (e.g., when offline), an error card is shown with a working **"Retry"** button.

---

## 2. Technical Specifications & Architecture

- [ ] **Expo & React Native:** Built using Expo (SDK 57) and React Native core components (`<View>`, `<Text>`, `<TextInput>`, `<TouchableOpacity>`, `<FlatList>`).
- [ ] **Functional Components & Hooks:** Uses `useState`, `useEffect`, and `useCallback` throughout.
- [ ] **No Backend Implementation Needed:** Strictly uses JSONPlaceholder.
- [ ] **Clean Component Separation:**
  - `src/services/api.js` (API communication layer)
  - `src/services/storage.js` (AsyncStorage helper)
  - `src/components/TodoItem.js` (Item rendering & interaction)
  - `src/components/AddTodoForm.js` (Form input & validation)
  - `src/components/LoadingState.js` (Spinner)
  - `src/components/ErrorState.js` (Error card & Retry)
  - `src/components/EmptyState.js` (Zero items placeholder)

---

## 3. Bonus Deliverable

- [ ] **AsyncStorage Persistence:**
  - Add, toggle, or delete tasks.
  - Refresh the page or close and reopen the app.
  - [ ] Tasks retain their modified state.

---

## 4. Submission & Delivery Checklist (For Amrin)

- [ ] **GitHub Repository:**
  - [ ] Repository created and set to **Public**.
  - [ ] All code pushed to the `main` branch.
- [ ] **README Documentation:**
  - [ ] Clear setup and run instructions (`npm install`, `npx expo start`).
  - [ ] Tech stack and features explained.
  - [ ] **AI Tool Usage Section Included:** Explicitly states how AI tools were used (architecture planning, component syntax mapping, error handling).
- [ ] **Share Link:** Send the public GitHub repository link to Amrin before 8:45 PM.
