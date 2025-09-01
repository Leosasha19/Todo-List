import React, {useEffect, useState} from 'react';
import {useTodo} from "../../context/todoContext";
import deleteImg from "../../assets/icons/delete/удалить.png"
import editImg from "../../assets/icons/edit/редактировать.png"
import './MainPage.scss';

const MainPage = () => {
    const {todos, toggleTodo, deleteTodo, addTodo, changeDescription } = useTodo()
    const [inputValue, setInputValue] = useState<string>("")
    const [modalWindow, setModalWindow] = useState<boolean>(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [editId, setEditId] = useState<number | null | boolean>(false)
    const [inputEditValue, setInputEditValue] = useState<string>("")
    const [filteredTodos, setFilteredTodos] = useState(todos)

    const handleSubmit = () => {
        if(!inputValue.trim()) return
        addTodo(inputValue)
        setInputValue("")
    }

    const deleteHandler = () => {
        if(deleteId !== null) {
            deleteTodo(deleteId);
            setModalWindow(false);
            setDeleteId(null);
        }
    }

    const handleEditChange = (e:React.ChangeEvent<HTMLInputElement>, id: number) => {
        if(id === editId) {
            setInputEditValue(e.target.value)
        }
    }

    const changeHandlerTodo = (id: number, inputEditValue: string) => {
        changeDescription(id, inputEditValue);
        setEditId(null);
    };

    const filteredDoneTodos = () => {
        if (todos) {
            const todo = todos.filter((todo) => todo.completed === true)
           setFilteredTodos(todo)
        }
    }

    const getAllTodos = () => {
        setFilteredTodos(todos)
    }

    const filteredUndoneTodos = () => {
        if (todos) {
            const todo = todos.filter((todo) => todo.completed === false)
            setFilteredTodos(todo)
        }
    }

    const deleteDoneTodos = () => {
        todos
            .filter(todo => todo.completed)
            .forEach(todo => deleteTodo(todo.id))
    }

    const deleteAllTodos = () => {
        todos.forEach(todo => deleteTodo(todo.id))
    }

    useEffect(() => {
        setFilteredTodos(todos);
    }, [todos]);

    return (
        <div className={"mainContainer"}>
            <div className={"mainContainer__header"}>
                <div className={"mainContainer__header__todos"}>Заметки</div>
                <div className={"mainContainer__header__topBox"}>
                    <input
                        onChange={(e) => setInputValue(e.target.value)}
                        className={"mainContainer__header__topBox__todoInput"}
                        type="text" value={inputValue || ""} placeholder={"Новая заметка ..."}/>
                    <button
                        onClick={handleSubmit}
                        className={"mainContainer__header__topBox__addTask"}>Добавить новую заметку
                    </button>
                </div>
            </div>
            <div className={"mainContainer__headerButtonsBox"}>
                <button
                    onClick={getAllTodos}
                    className={"mainContainer__headerButtonsBox__topButtons"}>Все</button>
                <button
                    onClick={filteredDoneTodos}
                    className={"mainContainer__headerButtonsBox__topButtons"}>Выполненные</button>
                <button
                    onClick={filteredUndoneTodos}
                    className={"mainContainer__headerButtonsBox__topButtons"}>Актуальные</button>
            </div>
            <div className={"mainContainer__todos"}>
                {filteredTodos && filteredTodos.map((item) => {
                    return (
                        <div
                            key={item.id}
                            className={item.completed && editId !== item.id ? "mainContainer__todos__todoComplited" : "mainContainer__todos__todo"}>
                            {editId === item.id ? (
                                <>
                                    <input
                                        className={"editInput"}
                                        type="text"
                                        value={inputEditValue}
                                        onChange={(e) => handleEditChange(e, item.id)}
                                    />
                                <button
                                     onClick={() => changeHandlerTodo(item.id, inputEditValue)}
                                    className={"editInputButtons"}>Изменить</button>
                                <button
                                    onClick={() => setEditId(null)}
                                    className={"editInputButtons"}>Отмена</button>
                                </>
                            ) : (
                                <div>
                                    {item.description}
                                </div>
                            )}

                            <div className={"mainContainer__todos__todo__rightBox"}>
                            <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() => toggleTodo(item.id)}
                                    name="" id=""/>
                                <img
                                    onClick={() => {
                                        setEditId(editId === item.id ? null : item.id);
                                        setInputEditValue(item.description);
                                    }}
                                    src={editImg} alt="Ярлык редактирования"/>
                                <img
                                    onClick={() => {setDeleteId(item.id); setModalWindow(true)}}
                                    src={deleteImg} alt="Ярлык удаления заметки"/>
                            </div>
                        </div>
                )
                })}
                {modalWindow && (
                    <>
                        <div className="modalOverlay" onClick={() => setModalWindow(false)}></div>
                        <div className={"modalWindowDelete"}>
                            <div className={"modalWindowDelete__text"}>Удалить заметку?</div>
                            <div className={"modalWindowDelete__boxButtons"}>
                                <button
                                    onClick={deleteHandler}
                                    className={"modalWindowDelete__boxButtons__oneButton"}>Да</button>
                                <button
                                    onClick={() => setModalWindow(false)}
                                    className={"modalWindowDelete__boxButtons__oneButton"}>Нет</button>
                            </div>
                        </div>
                    </>
                )
                }
            </div>
                <div className={"mainContainer__bottomBox"}>
                    <button
                        onClick={deleteDoneTodos}
                        className={"mainContainer__bottomBox__buttonsBot"}>Удалить выполненые заметки</button>
                    <button
                        onClick={deleteAllTodos}
                        className={"mainContainer__bottomBox__buttonsBot"}>Удалить все заметки</button>
                </div>
            </div>
            );
            };

            export default MainPage;