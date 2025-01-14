import { ColumnProp, TaskProp } from "@/types/types";
import { useEffect, useMemo, useState } from "react";
import Column from "../components/Column";
import NewColumn from "../components/NewColumn";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from "@dnd-kit/core";

const KanbanBoard = () => {
  //states
  const [columns, setColumns] = useState<ColumnProp[]>([]);
  const [tasks, setTasks] = useState<TaskProp[]>([]);
  const [activeTask, setActiveTask] = useState<TaskProp | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnProp | null>(null);

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

  // useEffects

  //use Local Storage to store the tasks
  useEffect(() => {
    const localColumns = localStorage.getItem("columns");

    if (localColumns) {
      try {
        const parsedColumns = JSON.parse(localColumns);
        setColumns(parsedColumns);
      } catch (error) {
        console.error("Error parsing columns from localStorage", error);
      }
    } else {
      console.log("No columns found in localStorage.");
    }
  }, []);

  useEffect(() => {
    const localTasks = localStorage.getItem("tasks");

    if (localTasks) {
      try {
        const parsedColumns = JSON.parse(localTasks);
        setTasks(parsedColumns);
      } catch (error) {
        console.error("Error parsing columns from localStorage", error);
      }
    } else {
      console.log("No columns found in localStorage.");
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

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 auto-rows-auto">
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

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className="w-full border bg-gray-50 px-2 py-2 rounded-lg font-medium">
              {activeTask.title}
              {activeTask.id}
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

  function onDragStart(e: DragEndEvent) {
    console.log("Drag start", e);
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

  function onDragEnd(e: DragEndEvent) {
    console.log("Drag end", e);
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
