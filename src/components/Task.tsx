import { TaskProp } from "@/types/types";

const Task = ({ task }: { task: TaskProp }) => {
  return <div className="w-full border bg-gray-50">{task.title}</div>;
};

export default Task;
