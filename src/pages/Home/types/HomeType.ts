import { ZodType, z } from "zod";

export type ToDoItem = {
  id: string;
  title: string;
  completed: boolean;
  editable: boolean;
};

export type ToDoCardPropsType = {
  id: string;
  title: string;
  isCompleted: boolean;
  editable: boolean;
  setEditable: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
};

export type FormData = {
  todoTitle: string;
};

export const TodosFormSchema: ZodType<FormData> = z.object({
  todoTitle: z
    .string()
    .min(1, { message: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters" }),
});
