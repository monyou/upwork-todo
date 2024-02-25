import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { v4 as uuid } from "uuid";
import { FormData, ToDoItem, TodosFormSchema } from "./types/HomeType";
import ToDoCard from "./ToDoCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGlobalStore } from "../../stores/global";

function Home() {
  const [todos, setTodos] = useState<ToDoItem[]>([]);
  const [editableId, setEditableId] = useGlobalStore((state) => [
    state.editableTodoId,
    state.setEditableTodoId,
  ]);
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      todoTitle: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(TodosFormSchema),
  });

  useEffect(() => {
    const todos = localStorage.getItem("todos");
    if (todos) {
      setTodos(JSON.parse(todos));
    }
  }, []);

  const createTodo = (formData: FormData) => {
    const newTodo: ToDoItem = {
      id: uuid(),
      title: formData.todoTitle.trim(),
      completed: false,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    toast.success("Todo created successfully");
    setEditableId(null);
    reset();
  };

  const toggleComplete = (id: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    toast.success("Todo deleted successfully");
  };

  const editTodo = (id: string, newTitle: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          title: newTitle.trim(),
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setEditableId(null);
    toast.success("Todo updated successfully");
  };

  return (
    <>
      <div id="home-page" className="container-fluid">
        <h1 className="text-center">My Todo List</h1>

        <div className="row justify-content-center mb-4 mt-2">
          <div className="col-12 col-lg-6">
            <form
              onSubmit={handleSubmit(createTodo)}
              id="todo-form-input"
              className="d-flex gap-2"
            >
              <input
                type="text"
                className="form-control"
                id="todoTitle"
                placeholder="start typing ..."
                {...register("todoTitle")}
              />

              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
          {errors.todoTitle && (
            <div className="offset-1 col-lg-7 mt-2">
              <span className="text-danger">{errors.todoTitle.message}</span>
            </div>
          )}
        </div>

        {!!todos.length && (
          <div id="todos-list">
            {todos.map((todo) => (
              <div key={todo.id} className="row justify-content-center mb-2">
                <div className="col-12 col-lg-6">
                  <ToDoCard
                    id={todo.id}
                    title={todo.title}
                    isCompleted={todo.completed}
                    editable={editableId === todo.id}
                    setEditable={(id) => setEditableId(id)}
                    onToggleComplete={toggleComplete}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Toaster position="bottom-center" />
    </>
  );
}

export default Home;
