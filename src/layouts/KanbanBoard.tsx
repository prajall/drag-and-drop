import { ColumnProp, TaskProp } from "@/types/types";
import { useState } from "react";
import Column from "../components/Column";
import NewColumn from "../components/NewColumn";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
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
    { title: "Task 2", columnId: "1", id: "11" },
  ]);
  const columnIds = columns.map((col) => col.id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  return (
    <div className=" grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        <SortableContext items={columnIds}>
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onDeleteColumn={deleteColumn}
            />
          ))}
        </SortableContext>
      </DndContext>
      <NewColumn onAddNewColumn={addNewColumn} columns={columns} />
    </div>
  );

  function onDragEnd(e: DragEndEvent) {
    const activeIndex = columns.findIndex((col) => col.id === e.active.id);
    const overIndex = columns.findIndex((col) => col.id === e.over?.id);

    if (activeIndex !== overIndex && overIndex !== -1) {
      const newColumns = arrayMove(columns, activeIndex, overIndex);
      setColumns(newColumns);
    }
  }

  function addNewColumn(id: string, title: string) {
    setColumns((columns) => [...columns, { id, title }]);
    console.log(columns);
  }
  function deleteColumn(id: string) {
    setColumns(() => columns.filter((col) => col.id !== id));
  }
};

export default KanbanBoard;
