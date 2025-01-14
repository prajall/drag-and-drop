# Vrit Technology Frontend Intern Task `B` (Optional)

## Drag-and-Drop Kanban Board

A Kanban board application built with React + Vite + Typescript and the DnD Kit library, featuring a clean user interface, drag-and-drop functionality, and persistent local storage for managing tasks and columns efficiently.

**Live Demo**: [https://drag-and-drop-snowy.vercel.app](https://drag-and-drop-snowy.vercel.app/)

**Time Spent**: `10 hrs`

---

## Features

- **Clean User Interface**: Intuitive and responsive design for easy task and column management.
- **Drag-and-Drop**: Effortlessly reorder tasks and columns with the DnD Kit library.
- **Local Storage**: Automatically saves columns and tasks, ensuring data persistence across sessions.
- **Keyboard Navigation**: Navigate and manage tasks and columns using arrow keys and other shortcuts.

---

## Technology Stack

- **React**: For building user interface.
- **DnD Kit**: For drag and drop functionality and sorting.
- **TailwindCSS**: For styling.
- **Shadcn UI**: For UI components

### **Build Tools**

- Vite
- TypeScript

---

## Setup Instructions

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/drag-and-drop-kanban.git
   cd drag-and-drop-kanban
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the app in your browser:
   ```
   http://localhost:5173
   ```

## Usage

1. Open the application in your browser.
2. Create new columns and tasks by clicking the "Add New Board" buttons.
3. Drag and drop tasks or columns to reorder them as needed.

### Keyboard Accesibility:

1. Press `ArrowRight` or `ArrowLeft` to focus on columns.
2. Press `ArrowUp` or `ArrowDown` to focus task.
3. Press `space` or `Enter` to select the focused column/task.
4. Move the selected element in desired location.
5. Press `space` or `Enter` to set the item in the new position.

---

## Known Limitations/Trade-offs

1. **Local Storage Persistence**:

   - Data is stored locally in the browser, so it is not accessible across devices.

2. **Keyboard Navigation**:

   - Limited support for navigating tasks and columns via keyboard (under development).
   - There are some glitches when navigation the items.

3. **No testing**:
   - Tests hasnt been written due to errors during setup of tests and lack of time/

---

## Future Improvements

1. **Enhanced Keyboard Navigation**:

   - Fully implement and refine keyboard navigation for accessibility.

2. **Theming and Customization**:
   - Allow users to customize the board’s appearance and behavior.
