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
      <div id="home-page" className="w-full px-2">
        <h1 className="text-center text-4xl font-medium">My Todo List</h1>

        <div className="mx-auto mb-6 mt-2 w-full lg:w-1/2">
          <form
            onSubmit={handleSubmit(createTodo)}
            id="todo-form-input"
            className="flex gap-2"
          >
            <input
              type="text"
              className="form-control"
              id="todoTitle"
              placeholder="Start typing ..."
              {...register("todoTitle")}
            />

            <button type="submit" className="btn-primary">
              Submit
            </button>
          </form>
          {errors.todoTitle && (
            <div className="mt-2">
              <span className="text-danger">{errors.todoTitle.message}</span>
            </div>
          )}
        </div>

        {!!todos.length && (
          <div id="todos-list">
            {todos.map((todo) => (
              <div key={todo.id} className="mx-auto mb-2 w-full lg:w-1/2">
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
            ))}
          </div>
        )}
      </div>

      <Toaster position="bottom-center" />
    </>
  );
}

export default Home;
