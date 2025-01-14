import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Column from "../components/Column";
import { ColumnProp, TaskProp } from "@/types/types";
import App from "../App";

// test("renders Column component with title and tasks", () => {
//   // Mock props
//   const mockColumn: ColumnProp = { id: "1", title: "New Task Column" };
//   const mockTasks: TaskProp[] = [
//     { id: "T123", title: "New Task", columnId: "1" },
//   ];

//   // Render the Column component
//   render(
//     <Column
//       column={mockColumn}
//       tasks={mockTasks}
//       onAddTask={jest.fn()}
//       onDeleteColumn={jest.fn()}
//     />
//   );

//   expect(screen.getByText("New Task Column")).toBeInTheDocument();

//   expect(screen.getByText("New Task")).toBeInTheDocument();

//   expect(screen.getByRole("button", { name: /add task/i })).toBeInTheDocument();
// });

test("Passing test", () => {
  render(<App />);
  expect(screen.getByText(/BetterToDo/i)).toBeInTheDocument();
});
