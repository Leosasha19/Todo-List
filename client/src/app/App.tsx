import MainPage from "../pages/MainPage/MainPage";
import {TodoProvider} from "../context/todoContext";
import './App.scss'

function App() {

  return (
    <>
        <TodoProvider>
            <MainPage/>
        </TodoProvider>
    </>
  )
}

export default App
