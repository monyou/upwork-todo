import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { v4 as uuid } from "uuid";
import { FormData, ToDoItem, TodosFormSchema } from "./types/HomeType";
import ToDoCard from "./ToDoCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function Home() {
  const [todos, setTodos] = useState<ToDoItem[]>([]);
  const {
    register,
    reset,
    formState: { errors, isValid },
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
    if (!isValid) return;

    const newTodo: ToDoItem = {
      id: uuid(),
      title: formData.todoTitle,
      completed: false,
      editable: false,
    };
    const updatedTodos = [
      ...todos.map((item) => ({ ...item, editable: false })),
      newTodo,
    ];
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    toast.success("Todo created successfully");
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
          title: newTitle,
          editable: false,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    toast.success("Todo updated successfully");
  };

  const setEditable = (id: string) => {
    const updatedTodos = todos.map((todo) => ({
      ...todo,
      editable: todo.id === id,
    }));
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  return (
    <>
      <div id="home-page">
        <h1 className="text-center">My Todo List</h1>

        <div className="row justify-content-center mb-4 mt-2">
          <div className="col-6">
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
            <div className="col-7 offset-1 mt-2">
              <span className="text-danger">{errors.todoTitle.message}</span>
            </div>
          )}
        </div>

        {!!todos.length && (
          <div id="todos-list">
            {todos.map((todo) => (
              <div key={todo.id} className="row justify-content-center mb-2">
                <div className="col-6">
                  <ToDoCard
                    id={todo.id}
                    title={todo.title}
                    isCompleted={todo.completed}
                    editable={todo.editable}
                    setEditable={setEditable}
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

      <Toaster
        toastOptions={{
          className: "",
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
        }}
      />
    </>
  );
}

export default Home;
