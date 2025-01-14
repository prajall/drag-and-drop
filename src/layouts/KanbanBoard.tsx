import { ColumnProp, TaskProp } from "@/types/types";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useEffect, useMemo, useState } from "react";
import Column from "../components/Column";
import NewColumn from "../components/NewColumn";

const KanbanBoard = () => {
  //states
  const [columns, setColumns] = useState<ColumnProp[]>([]);
  const [tasks, setTasks] = useState<TaskProp[]>([]);
  const [activeTask, setActiveTask] = useState<TaskProp | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnProp | null>(null);
  const [canChangeFocus, setCanChangeFocus] = useState<boolean>(true);

  const [focusedColumnIndex, setFocusedColumnIndex] = useState<number | null>(
    null
  );
  const [focusedTaskIndex, setFocusedTaskIndex] = useState<number | null>(null);

  // constants
  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    }),
    useSensor(KeyboardSensor, {
      // coordinateGetter: customCoordinateGetter,
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /* useEffects */

  //Populate tasks and columns from local Storage
  useEffect(() => {
    const localColumns = localStorage.getItem("columns");
    const localTasks = localStorage.getItem("tasks");
    const alreadyLoggedIn = localStorage.getItem("alreadyLoggedIn") || false;

    if (!alreadyLoggedIn) {
      setColumns([
        { id: "C7", title: "📋 To Do" },
        { id: "C5", title: "🔘 In Progress" },
        { id: "C6", title: "✔️ Completed" },
      ]);
      setTasks([
        { id: "T5", columnId: "C6", title: "Sketch" },
        { id: "T1", columnId: "C6", title: "Make Breakfast" },
        { id: "T3", columnId: "C7", title: "Fix lighting in the room" },
        { id: "T6", columnId: "C5", title: "College project" },
        { id: "T4", columnId: "C5", title: "Prepare for exam" },
      ]);
      localStorage.setItem("alreadyLoggedIn", "true");
      return;
    }

    if (localColumns) {
      try {
        const parsedColumns = JSON.parse(localColumns);
        setColumns(parsedColumns);
      } catch (error) {
        console.error("Error parsing columns from localStorage", error);
      }
    }

    if (localTasks) {
      try {
        const parsedColumns = JSON.parse(localTasks);
        setTasks(parsedColumns);
      } catch (error) {
        console.error("Error parsing columns from localStorage", error);
      }
    }
  }, []);

  // Save columns to localStorage when it changes
  useEffect(() => {
    if (columns.length > 0) {
      localStorage.setItem("columns", JSON.stringify(columns));
    }
  }, [columns]);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  /* -------------------------------------------------------------------------------
             For keyboard events to select tasks and columns 
   --------------------------------------------------------------------------------- */

  // Update focuses/select.
  useEffect(() => {
    // If we have a focusedColumnIndex but no tasks are focused, focus the column DOM element
    if (
      focusedColumnIndex !== null &&
      (focusedTaskIndex === null || focusedTaskIndex < 0)
    ) {
      const columnId = columns[focusedColumnIndex]?.id;
      const colElement = document.getElementById(`column-${columnId}`);
      if (colElement) {
        colElement.focus();
      }
    }
    // If we have a valid focused column & focused task, focus the task DOM element
    else if (
      focusedColumnIndex !== null &&
      focusedColumnIndex >= 0 &&
      focusedTaskIndex !== null &&
      focusedTaskIndex >= 0
    ) {
      const columnId = columns[focusedColumnIndex].id;
      // filter tasks for that column
      const tasksOfThisColumn = tasks.filter((t) => t.columnId === columnId);
      const taskId = tasksOfThisColumn[focusedTaskIndex]?.id;
      const taskElement = document.getElementById(`task-${taskId}`);
      if (taskElement) {
        taskElement.focus();
      }
    }
  }, [focusedColumnIndex, focusedTaskIndex, columns, tasks]);

  //Arrow key listeners to switch the selected items
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;

      console.log("Can change focus:", canChangeFocus, e.key);

      if (!canChangeFocus) {
        return;
      }

      // 1) If nothing is focused yet:
      if (focusedColumnIndex === null && focusedTaskIndex === null) {
        if (
          key === "ArrowLeft" ||
          key === "ArrowRight" ||
          key === "ArrowDown" ||
          key === "ArrowUp"
        ) {
          // Focus the first column
          if (columns.length > 0) {
            setFocusedColumnIndex(0);
          }
        }
        return;
      }

      // 2) If a column is focused but no task:
      if (
        focusedColumnIndex !== null &&
        (focusedTaskIndex === null || focusedTaskIndex < 0)
      ) {
        switch (key) {
          case "ArrowRight": {
            // Move to the next column if exists
            const nextIndex = focusedColumnIndex + 1;
            if (nextIndex < columns.length) {
              setFocusedColumnIndex(nextIndex);
            }
            break;
          }
          case "ArrowLeft": {
            // Move to the previous column if exists
            const prevIndex = focusedColumnIndex - 1;
            if (prevIndex >= 0) {
              setFocusedColumnIndex(prevIndex);
            }
            break;
          }
          case "ArrowDown": {
            // Focus the first task in the currently focused column
            const colId = columns[focusedColumnIndex].id;
            const tasksOfThisColumn = tasks.filter((t) => t.columnId === colId);
            if (tasksOfThisColumn.length > 0) {
              setFocusedTaskIndex(0);
            }
            break;
          }
        }
      }
      // 3) If a task is focused:
      else if (focusedColumnIndex !== null && focusedTaskIndex !== null) {
        const colId = columns[focusedColumnIndex].id;
        const tasksOfThisColumn = tasks.filter((t) => t.columnId === colId);
        switch (key) {
          case "ArrowDown": {
            const nextTaskIndex = focusedTaskIndex + 1;
            if (nextTaskIndex < tasksOfThisColumn.length) {
              setFocusedTaskIndex(nextTaskIndex);
            }
            break;
          }
          case "ArrowUp": {
            // Move to previous task if possible
            const prevTaskIndex = focusedTaskIndex - 1;
            if (prevTaskIndex >= 0) {
              setFocusedTaskIndex(prevTaskIndex);
            }

            break;
          }
          case "ArrowRight":
          case "ArrowLeft": {
            setFocusedTaskIndex(null);
            if (key === "ArrowRight") {
              const nextIndex = focusedColumnIndex + 1;
              if (nextIndex < columns.length) {
                setFocusedColumnIndex(nextIndex);
              }
            } else {
              const prevIndex = focusedColumnIndex - 1;
              if (prevIndex >= 0) {
                setFocusedColumnIndex(prevIndex);
              }
            }
            break;
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedColumnIndex, focusedTaskIndex, columns, tasks]);

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 auto-rows-auto ">
      <DndContext
        collisionDetection={closestCenter}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <SortableContext items={columnIds}>
          {columns.map((column) => (
            <Column
              onDeleteTask={deleteTask}
              key={column.id}
              column={column}
              onDeleteColumn={deleteColumn}
              onAddTask={addTask}
              tasks={tasks.filter((task) => task.columnId === column.id)}
            />
          ))}
        </SortableContext>

        <NewColumn onAddNewColumn={addNewColumn} columns={columns} />

        <DragOverlay>
          {activeTask ? (
            <div className="w-full border bg-gray-50 px-2 py-2 rounded-lg font-medium text-sm">
              {activeTask.title}
            </div>
          ) : activeColumn ? (
            <Column
              onDeleteTask={deleteTask}
              key={activeColumn.id}
              column={activeColumn}
              onDeleteColumn={deleteColumn}
              onAddTask={addTask}
              tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );

  //additional functions
  function onDragStart(e: DragEndEvent) {
    console.log("Drag start", e);
    //prevent selection change after selecting an element
    setCanChangeFocus(false);
    const activeType = e.active.data.current?.type;
    if (activeType === "task") {
      const activeTask = tasks.find((task) => task.id === e.active.id) || null;
      setActiveTask(activeTask);
    } else if (activeType === "column") {
      const activeColumn =
        columns.find((column) => column.id === e.active.id) || null;
      setActiveColumn(activeColumn);
    }
  }

  //functions
  function onDragEnd(e: DragEndEvent) {
    console.log("Drag end", e);
    setCanChangeFocus(true);
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = e;
    const activeType = active.data.current?.type;

    if (!over) return;

    if (activeType === "column") {
      // Handle column reordering
      const activeIndex = columns.findIndex((col) => col.id === active.id);
      const overIndex = columns.findIndex((col) => col.id === over.id);

      if (activeIndex !== overIndex && overIndex !== -1) {
        const newColumns = arrayMove(columns, activeIndex, overIndex);
        setColumns(newColumns);
      }
    } else if (activeType === "task") {
      // Handle task dragging
      const activeTaskIndex = tasks.findIndex((task) => task.id === active.id);
      const overType = over.data.current?.type;

      if (overType === "task") {
        // Reordering tasks within the same column
        const overTaskIndex = tasks.findIndex((task) => task.id === over.id);
        if (activeTaskIndex !== overTaskIndex) {
          const newTasks = arrayMove(tasks, activeTaskIndex, overTaskIndex);
          setTasks(newTasks);
        }
      } else if (overType === "column") {
        // Moving tasks between columns
        const overColumnId = over.id;

        setTasks((prevTasks) => {
          const updatedTasks = [...prevTasks];
          updatedTasks[activeTaskIndex].columnId = overColumnId.toString();
          return updatedTasks;
        });
      }
    }
  }

  function onDragOver(e: DragOverEvent) {
    const isActiveTask = e.active.data.current?.type === "task";
    const isOverTask = e.over?.data.current?.type === "task";

    // If dragging a task
    if (isActiveTask) {
      if (isOverTask) {
        // Handle task reorder inside the same column
        const activeIndex = tasks.findIndex((task) => task.id === e.active.id);
        const overIndex = tasks.findIndex((task) => task.id === e.over?.id);

        if (activeIndex !== overIndex) {
          const newTasks = arrayMove(tasks, activeIndex, overIndex);
          setTasks(newTasks);
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
        }
      } else {
        // Dropping task on an empty column (no task)
        const overColumnId = e.over?.id;
        if (overColumnId) {
          setTasks((prevTasks) => {
            const activeIndex = prevTasks.findIndex(
              (task) => task.id === e.active.id
            );
            const newTasks = [...prevTasks];
            newTasks[activeIndex].columnId = overColumnId.toString();
            return newTasks;
          });
        }
      }
    }
  }

  function addNewColumn(id: string, title: string) {
    setColumns((columns) => [...columns, { id, title }]);
  }

  function deleteColumn(id: string) {
    setColumns(() => columns.filter((col) => col.id !== id));
  }
  function deleteTask(id: string) {
    setTasks(() => tasks.filter((task) => task.id !== id));
  }

  function addTask(columnId: string, title: string) {
    const ids = tasks.map((task) => parseInt(task.id.split("T")[1], 10)) || [];
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    setTasks((prev) => [
      ...prev,
      { id: "T" + (maxId + 1).toString(), columnId, title },
    ]);
  }
};

export default KanbanBoard;
