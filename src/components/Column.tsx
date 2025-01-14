import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnProp, TaskProp } from "@/types/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EllipsisVertical, PlusCircle } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import Task from "./Task";

const Column = React.memo(
  ({
    column,
    onDeleteColumn,
    onAddTask,
    tasks,
    onDeleteTask,
  }: {
    column: ColumnProp;
    onDeleteColumn: (id: string) => void;
    onAddTask: (id: string, title: string) => void;
    tasks: TaskProp[];
    onDeleteTask?: (id: string) => void;
  }) => {
    //states
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [inputTitle, setInputTitle] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (showAddForm && e.key === "Escape") {
        setInputTitle("");
        setShowAddForm(false);
      }
    };

    useEffect(() => {
      document.addEventListener("keydown", handleKeyDown);

      // Cleanup function to remove the event listener
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [showAddForm]);

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      onAddTask(column.id, inputTitle);
      setShowAddForm(false);
      setInputTitle("");
    }

    if (isDragging) {
      return (
        <div
          ref={setNodeRef}
          style={style}
          className={`w-full opacity-50 border border-gray-300 min-h-96 bg-gray-50 p-3 rounded-lg font-semibold flex flex-col relative -z-50`}
        >
          <div
            {...listeners}
            {...attributes}
            className="opacity-0 w-full flex justify-between cursor-grab active:cursor-grabbing"
          >
            {title}
          </div>

          {/* Task List */}
          <div className="opacity-0 gap-2 flex flex-col py-4">
            {tasks.map((task) => (
              <Task onDeleteTask={() => {}} task={task} key={task.id} />
            ))}
          </div>

          {/* Add Task Button */}
          <Button
            variant="secondary"
            className="opacity-0 mt-auto w-full py-2 rounded-md duration-200"
          >
            Add Task
          </Button>
        </div>
      );
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`w-full min-h-96 bg-gray-100 p-3 rounded-lg font-semibold ease-in-out flex flex-col relative z-50`}
      >
        <div
          id={`column-${column.id}`} // Id for adding keyboard event
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
              <Task task={task} key={task.id} onDeleteTask={onDeleteTask} />
            ))}
          </SortableContext>
          {showAddForm && (
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="mt-auto w-full py-2 px-2 font-medium text-sm shadow-none focus:outline-gray-500 rounded-md flex justify-start"
                value={inputTitle}
                onChange={(e) => {
                  setInputTitle(e.target.value);
                }}
                placeholder="Enter New Task"
                onBlur={() => {
                  setInputTitle(""); // Clear the input
                  setShowAddForm(false); // Hide the form
                }}
              />
            </form>
          )}
        </div>

        <Button
          variant="secondary"
          className="mt-auto w-full p-0 py-2 shadow-none flex  "
          onClick={() => {
            setShowAddForm(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
        >
          <PlusCircle />
          Add Task
        </Button>
      </div>
    );
  }
);

export default Column;
