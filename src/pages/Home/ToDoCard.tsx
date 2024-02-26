import { FC } from "react";
import { ToDoCardPropsType, TodosFormSchema, FormData } from "./types/HomeType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const ToDoCard: FC<ToDoCardPropsType> = ({
  id,
  title,
  isCompleted,
  editable,
  setEditable,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      todoTitle: title,
    },
    mode: "onSubmit",
    resolver: zodResolver(TodosFormSchema),
  });

  return (
    <div className="todo-card rounded-md border border-black/20 bg-gray-800 p-4">
      {editable ? (
        <div>
          <form
            onSubmit={handleSubmit((data) => onEdit(id, data.todoTitle))}
            id="todo-form-input"
            className="flex gap-2"
          >
            <input
              type="text"
              className="form-control"
              {...register("todoTitle")}
            />

            <button type="submit" className="btn-warning">
              Update
            </button>
          </form>
          {errors.todoTitle && (
            <div className="mt-2">
              <span className="text-danger">{errors.todoTitle.message}</span>
            </div>
          )}
        </div>
      ) : (
        <>
          <h5 className={`mb-4 text-xl ${isCompleted ? "line-through" : ""}`}>
            {title}
          </h5>
          <div className="mt-3 flex justify-between">
            <button
              className="btn outline-1 active:outline"
              onClick={() => onToggleComplete(id)}
            >
              <i
                className={
                  isCompleted
                    ? "fa-solid fa-rotate mr-2"
                    : "fa-regular fa-square-check mr-2"
                }
              ></i>
              {isCompleted ? "Mark Undone" : "Mark Completed"}
            </button>
            <div className="flex flex-col sm:flex-row">
              <button
                className="btn outline-1 active:outline"
                onClick={() => setEditable(id)}
              >
                <i className="fa-regular fa-pen-to-square mr-1.5"></i>
                Edit
              </button>
              <button
                className="btn text-danger outline-1 active:outline"
                onClick={() => onDelete(id)}
              >
                <i className="fa-solid fa-trash mr-1.5"></i>
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ToDoCard;
