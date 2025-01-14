import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useEffect, useState } from "react";
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

    const ids =
      columns.map((column) => parseInt(column.id.split("C")[1], 10)) || [];
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    console.log(maxId);

    if (title.trim() !== "") {
      onAddNewColumn("C" + (maxId + 1).toString(), title);
    }
    setTitle("");
    setDialogOpen(false);
  };

  useEffect(() => {
    if (dialogOpen) {
      return;
    }
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      console.log(e);
      if (e.key === "N" && e.shiftKey === true) {
        setDialogOpen(true);
      }
    });
  }, []);

  return (
    <Dialog open={dialogOpen} onOpenChange={(value) => setDialogOpen(value)}>
      <DialogTrigger className="w-full h-10 border border-gray-300 bg-gray-100 duration-300 hover:bg-gray-200 text-gray-700 hover:text-gray-800 gap-2 flex justify-center items-center rounded-md">
        <CirclePlus size={18} />
        <p className="font-semibold">Add New Board</p>
      </DialogTrigger>
      <DialogContent className="w-96">
        <DialogHeader>
          <DialogTitle>Add new Board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <div className="">
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full max-w-full p-2 border border-gray-100 focus:outline-gray-300 focus:outline rounded-md"
              placeholder="Title"
              required
            />
          </div>
          <Button type="submit" variant={"secondary"} className="">
            Add
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewColumn;
