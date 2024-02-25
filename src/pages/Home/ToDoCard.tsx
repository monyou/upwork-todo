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
    <div className="todo-card card text-bg-dark">
      <div className="card-body">
        {editable ? (
          <div>
            <form
              onSubmit={handleSubmit((data) => onEdit(id, data.todoTitle))}
              id="todo-form-input"
              className="d-flex gap-2"
            >
              <input
                type="text"
                className="form-control"
                {...register("todoTitle")}
              />

              <button type="submit" className="btn btn-warning">
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
            <h5
              className={`card-title ${isCompleted ? "text-decoration-line-through" : ""}`}
            >
              {title}
            </h5>
            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn text-light"
                onClick={() => onToggleComplete(id)}
              >
                <i
                  style={{ marginRight: "10px" }}
                  className={
                    isCompleted
                      ? "fa-solid fa-rotate"
                      : "fa-regular fa-square-check"
                  }
                ></i>
                {isCompleted ? "Mark Undone" : "Mark Completed"}
              </button>
              <div className="d-flex flex-column flex-sm-row">
                <button
                  className="btn text-light"
                  onClick={() => setEditable(id)}
                >
                  <i
                    style={{ marginRight: "5px" }}
                    className="fa-regular fa-pen-to-square"
                  ></i>
                  Edit
                </button>
                <button
                  className="btn text-danger"
                  onClick={() => onDelete(id)}
                >
                  <i
                    style={{ marginRight: "5px" }}
                    className="fa-solid fa-trash"
                  ></i>
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ToDoCard;
