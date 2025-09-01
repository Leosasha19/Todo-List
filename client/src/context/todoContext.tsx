import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import axios from "axios";

export type Todo = {
    id: number;
    description: string;
    completed: boolean;
};

export type TodoContextType = {
    todos: Todo[];
    getTodos: () => Promise<Todo[]>;
    addTodo: (description: string) => Promise<void>;
    deleteTodo: (id: number) => Promise<void>;
    toggleTodo: (id: number) => Promise<void>;
    changeDescription: (id:number,description: string) => Promise<void>;
}

const api = import.meta.env.VITE_API_URL;

export const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({children} : {children: ReactNode}) => {
    const [todos, setTodos] = useState<Todo[]>([]);

    const getTodos = async () => {
        const response = await axios.get<Todo[]>(`${api}/todos`)
        const sortedTodos = response.data.sort((a:Todo, b:Todo) => a.id - b.id);
        setTodos(sortedTodos);
        return sortedTodos;
    }

    const addTodo = async (description: string) => {
        const response = await axios.post(`${api}/todos`, {
            description,
            completed: false,
        });
        const newTodo = response.data;
        setTodos((prev) => [...prev, newTodo])
    };
    const deleteTodo = async (id:number) => {
        await axios.delete(`${api}/todos/${id}`)
        setTodos((prev) => prev.filter((todo) => todo.id !== id))
    }
    const toggleTodo = async (id:number) => {
        const todo = todos.find((t) => t.id === id)
        if(!todo) return

        try {
            const updatedTodo = { ...todo, completed: !todo.completed };

            const response = await axios.put(`${api}/todos/${id}`, updatedTodo)
            console.log("Состояние успешно изменено")

            setTodos((prev) => prev.map((t) => (t.id === id? response.data : t)))

        } catch (error) {
            console.log("Ошибка изменения состояния",error);
        }
    }

    const changeDescription = async (id:number, newDescription: string) => {
        const todo = todos.find((t) => t.id === id)
        if (!todo) return
        try {
            const updatedTodo = { ...todo, description: newDescription};
            const response = await axios.put(`${api}/todos/description/${id}`, updatedTodo)
            console.log("Состояние описания успешно изменено")
            setTodos((prev) =>
                prev.map((t) => (t.id === id ? { ...t, description: response.data.description } : t))
            );
        } catch (error) {
            console.log("Ошибка изменения описания",error);
        }
    }
    useEffect(() => {
        getTodos();
    },[])

    return (
        <TodoContext.Provider value={{todos, getTodos, addTodo, deleteTodo, toggleTodo, changeDescription}}>
            {children}
        </TodoContext.Provider>
    )
};

export const useTodo = () => {
    const context = useContext(TodoContext)
    if(!context) {
        throw new Error("useTodo должен использоваться внутри TodoProvider");
    }
    return context;
}

