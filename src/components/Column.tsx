import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnProp } from "@/types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EllipsisVertical } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

const Column = React.memo(
  ({
    column,
    onDeleteColumn,
  }: {
    column: ColumnProp;
    onDeleteColumn: (id: string) => void;
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

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`w-full min-h-48 bg-gray-100 p-3 rounded-lg font-semibold ease-in-out flex flex-col`}
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

        {/* Add Task Button */}
        <Button
          variant="secondary"
          className="mt-auto w-full py-2 rounded-md duration-200 bg-gray-50 hover:bg-white"
          onClick={() => console.log("Add Task clicked for column:", id)}
        >
          Add Task
        </Button>
      </div>
    );
  }
);

export default Column;
