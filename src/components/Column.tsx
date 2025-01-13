import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnProp, TaskProp } from "@/types/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EllipsisVertical } from "lucide-react";
import React, { useMemo } from "react";
import { Button } from "./ui/button";
import Task from "./Task";

const Column = React.memo(
  ({
    column,
    onDeleteColumn,
    onAddTask,
    tasks,
  }: {
    column: ColumnProp;
    onDeleteColumn: (id: string) => void;
    onAddTask: (id: string) => void;
    tasks: TaskProp[];
  }) => {
    const { id, title } = column;

    const {
      setNodeRef,
      attributes,
      listeners,
      isDragging,
      transform,
      transition,
    } = useSortable({
      id,
      data: {
        type: "column",
        column,
      },
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 999 : "auto",
    };

    const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`w-full min-h-52 bg-gray-100 p-3 rounded-lg font-semibold ease-in-out flex flex-col`}
      >
        <div
          {...listeners}
          {...attributes}
          className="w-full flex justify-between cursor-grab active:cursor-grabbing"
        >
          {title}
          <DropdownMenu>
            <DropdownMenuTrigger className="text-gray-700">
              <EllipsisVertical size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onDeleteColumn(column.id)}>
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Task List */}
        <div className="gap-2 flex flex-col py-4">
          <SortableContext items={taskIds}>
            {tasks.map((task) => (
              <Task task={task} key={task.id} />
            ))}
          </SortableContext>
        </div>

        {/* Add Task Button */}
        <Button
          variant="secondary"
          className="mt-auto w-full py-2 rounded-md duration-200"
          onClick={() => onAddTask(column.id)}
        >
          Add Task
        </Button>
      </div>
    );
  }
);

export default Column;
