import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { ColumnProp } from "@/types/types";

type NewColumnProp = {
  onAddNewColumn: (id: string, title: string) => void;
  columns: ColumnProp[];
};

const NewColumn: React.FC<NewColumnProp> = ({ onAddNewColumn, columns }) => {
  const [title, setTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ids = columns.map((column) => parseInt(column.id.split("C")[1], 10)) || [];
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    console.log(maxId);

    if (title.trim() !== "") {
      onAddNewColumn("C"+(maxId + 1).toString(), title);
    }
    setTitle("");
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(value) => setDialogOpen(value)}>
      <DialogTrigger>
        <button className="w-full h-48 bg-gray-100 duration-300 hover:bg-gray-200 text-gray-700 hover:text-gray-800 flex flex-col gap-4 justify-center items-center rounded-md">
          <CirclePlus size={40} fontWeight={100} />
          <p className="font-semibold">Add New Board</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new Board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="">
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-100 focus:outline-gray-300 focus:outline rounded-md"
              placeholder="Title"
              required
            />
          </div>
          <Button type="submit" variant={"secondary"} className="">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewColumn;
