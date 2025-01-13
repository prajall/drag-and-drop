import { ColumnProp, TaskProp } from "@/types/types";
import { useMemo, useState } from "react";
import Column from "../components/Column";
import NewColumn from "../components/NewColumn";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnProp[]>([]);
  const [tasks, setTasks] = useState<TaskProp[]>([
    {
      title: "Task 1",
      columnId: "1",
      id: "11",
      description: "This is a task 1",
    },
    { title: "Task 2", columnId: "1", id: "12" },
  ]);

  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 auto-rows-auto">
      <DndContext
        collisionDetection={closestCenter}
        sensors={sensors}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <SortableContext items={columnIds}>
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onDeleteColumn={deleteColumn}
              onAddTask={addTask}
              tasks={tasks.filter((task) => task.columnId === column.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
      <NewColumn onAddNewColumn={addNewColumn} columns={columns} />
    </div>
  );

  function onDragEnd(e: DragEndEvent) {
    const activeType = e.active.data.current?.type;
    if (activeType === "column") {
      // Handle column reorder
      const activeIndex = columns.findIndex((col) => col.id === e.active.id);
      const overIndex = columns.findIndex((col) => col.id === e.over?.id);

      if (activeIndex !== overIndex && overIndex !== -1) {
        const newColumns = arrayMove(columns, activeIndex, overIndex);
        setColumns(newColumns); // set the reordered column
      }
    } else if (activeType === "task") {
      // Handle task reorder or move to another column
      const activeTaskIndex = tasks.findIndex(
        (task) => task.id === e.active.id
      );
      const overIndex = columns.findIndex((col) => col.id === e.over?.id);

      if (overIndex !== -1) {
        // Task dropped on a column
        setTasks((prevTasks) => {
          const newTasks = [...prevTasks];
          newTasks[activeTaskIndex].columnId = columns[overIndex].id;
          return newTasks;
        });
      } else {
        // If task is dropped back into the same column, we don't need to update
        const overTaskIndex = tasks.findIndex((task) => task.id === e.over?.id);
        if (activeTaskIndex !== overTaskIndex && overTaskIndex !== -1) {
          const newTasks = arrayMove(tasks, activeTaskIndex, overTaskIndex);
          setTasks(newTasks);
          tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;
        }
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
    console.log(columns);
  }

  function deleteColumn(id: string) {
    setColumns(() => columns.filter((col) => col.id !== id));
  }

  function addTask(columnId: string) {
    const ids = tasks.map((task) => parseInt(task.id, 10)) || [];
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    setTasks((prev) => [
      ...prev,
      { id: (maxId + 1).toString(), columnId, title: "Title" },
    ]);
  }
};

export default KanbanBoard;
