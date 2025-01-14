import { TaskProp } from "@/types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash } from "lucide-react";
import React from "react";

const Task = React.memo(
  ({
    task,
    onDeleteTask,
  }: {
    task: TaskProp;
    onDeleteTask?: (id: string) => void;
  }) => {
    const {
      setNodeRef,
      attributes,
      listeners,
      isDragging,
      transform,
      transition,
    } = useSortable({
      id: task.id,
      data: {
        type: "task",
        task,
      },
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 999 : "auto",
    };

    //When dragging, how the preview of the task
    if (isDragging) {
      return (
        <div
          style={style}
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className="w-full h-10  bg-white/50  px-2 py-2 rounded-lg text-sm font-medium"
        ></div>
      );
    }

    return (
      <div
        id={`task-${task.id}`}
        style={style}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className="w-full border bg-gray-50 px-2 py-2 rounded-lg font-medium text-sm flex items-center justify-between"
      >
        <p>{task.title}</p>

        <button
          onClick={() => (onDeleteTask ? onDeleteTask(task.id) : () => {})}
          className="text-gray-600"
        >
          <Trash size={15} />
        </button>
      </div>
    );
  }
);

export default Task;
