export type ColumnProp = {
  id: string;
  title: string;
};

export type TaskProp = {
  id: string;
  title: string;
  description?: string;
  columnId: string;
};
